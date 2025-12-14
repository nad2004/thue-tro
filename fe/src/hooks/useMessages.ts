import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/config/axios';
import { Message } from '@/types/Message';

interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const useMessages = (conversationID: string | null): UseMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Mặc định là có thể load thêm

  const fetchMessages = useCallback(async (pageNum: number) => {
    if (!conversationID) return;

    try {
      setLoading(true);
      
      // Gọi API
      const response = await axiosInstance.get(`/messages/conversation/${conversationID}`, {
        params: {
          page: pageNum,
          limit: 20, // Mỗi lần load 20 tin
        },
      });

      // Trích xuất dữ liệu chuẩn từ BE trả về
      // Cấu trúc BE: { data: Array, meta: Object }
      const { data: newMessages, meta } = response.data.data; // 👈 FIX LỖI "map is not a function" TẠI ĐÂY
      setMessages((prev) => {
        if (pageNum === 1) {
          return newMessages; // Trang 1 (mới nhất) -> Ghi đè
        } else {
          // Trang > 1 (tin cũ hơn) -> Nối vào đầu mảng cũ
          return [...newMessages, ...prev];
        }
      });

      // Kiểm tra xem còn trang sau không
      setHasMore(pageNum < meta.totalPages);
      
    } catch (err) {
      console.error('Lỗi tải tin nhắn:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationID]);

  // Reset khi đổi hội thoại
  useEffect(() => {
    if (conversationID) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      fetchMessages(1);
    }
  }, [conversationID]); // Bỏ fetchMessages ra khỏi dep array để tránh loop

  // Hàm loadMore dùng cho Infinite Scroll
  const loadMore = async () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchMessages(nextPage);
    }
  };

  return {
    messages,
    loading,
    hasMore,
    loadMore,
    setMessages,
  };
};