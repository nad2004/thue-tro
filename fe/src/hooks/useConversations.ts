import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import axiosInstance from '@/lib/config/axios';
import { IConversation } from '@/types/Conversation';
import { useSocket } from './useSocket'; // Import useSocket
import { useAuthStore } from '@/store/auth-store';

export const useConversations = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy socket từ hook
  const { socket } = useSocket();
  const user = useAuthStore((state) => state.user);

  // Dùng ref để tránh stale closure khi handle socket event
  const conversationsRef = useRef<IConversation[]>([]);

  // Cập nhật ref mỗi khi state thay đổi
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // 1. Fetch Data ban đầu qua API
  const fetchConversations = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/conversations');
      const fetchedConversations = response.data.data || [];
      
      setConversations(fetchedConversations);

      // SAU KHI FETCH: Join vào tất cả các room conversation để lắng nghe tin nhắn mới
      if (socket && fetchedConversations.length > 0) {
        fetchedConversations.forEach((conv: IConversation) => {
          socket.emit('join_conversation', conv._id);
        });
      }

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Không thể tải danh sách hội thoại';
      setError(errorMsg);
      // message.error(errorMsg); // Có thể ẩn để đỡ spam lỗi khi user chưa login
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, socket]);

  // 2. Hàm đánh dấu đã đọc
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      // Gọi API background
      await axiosInstance.patch(`/conversations/${conversationId}/unread`, { count: 0 });
      
      // Update local state ngay lập tức cho mượt
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (err) {
      console.error('Error marking conversation as read:', err);
    }
  }, []);

  // 3. Tính tổng tin chưa đọc
  const getTotalUnreadCount = useCallback(() => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }, [conversations]);

  // 4. LOGIC REAL-TIME SOCKET
  useEffect(() => {
    if (!socket) return;

    // Handler khi có tin nhắn mới
    const handleReceiveMessage = (newMessage: any) => {
      // newMessage chứa: { conversationID, content, senderID, createdAt, ... }
      
      setConversations((prev) => {
        const currentList = [...prev];
        const index = currentList.findIndex(c => c._id === newMessage.conversationID);

        if (index !== -1) {
          // A. Nếu hội thoại đã có trong list
          const updatedConv = { ...currentList[index] };
          
          // Cập nhật snippet và thời gian
          updatedConv.lastMessageSnippet = newMessage.type === 'Image' ? '[Hình ảnh]' : newMessage.content;
          updatedConv.lastMessageTime = newMessage.createdAt || new Date();

          // Tăng unreadCount nếu người gửi KHÔNG PHẢI là mình
          if (newMessage.senderID._id !== user?._id && newMessage.senderID !== user?._id) {
             updatedConv.unreadCount += 1;
          }

          // Xóa vị trí cũ
          currentList.splice(index, 1);
          // Đưa lên đầu danh sách
          currentList.unshift(updatedConv);
          
          return currentList;
        } else {
          // B. Trường hợp hội thoại mới (chưa có trong list)
          // Tốt nhất là gọi lại fetchConversations() để lấy full data (buyerID, ownerID populate)
          fetchConversations();
          return prev;
        }
      });
    };

    // Lắng nghe sự kiện
    socket.on('receive_message', handleReceiveMessage);

    // Nếu socket bị disconnect và connect lại -> Join lại các phòng
    socket.on('connect', () => {
        conversationsRef.current.forEach((conv) => {
            socket.emit('join_conversation', conv._id);
        });
    });

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('connect');
    };
  }, [socket, user, fetchConversations]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
    markAsRead,
    totalUnreadCount: getTotalUnreadCount(),
  };
};