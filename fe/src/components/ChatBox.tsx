import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Button, Avatar, message, Spin, Typography } from 'antd';
import { Send, X, User, MessageCircle, Loader2 } from 'lucide-react';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useAuthStore } from '@/store/auth-store';
import { useMessages } from '@/hooks/useMessages';
import { IUser } from '@/types/User';

const { Text } = Typography;

interface ChatBoxProps {
  visible: boolean;
  onClose: () => void;
  recipient: IUser | null;
  conversationId?: string; 
}

const ChatBox: React.FC<ChatBoxProps> = ({ visible, onClose, recipient, conversationId: initialConversationId }) => {
  const user = useAuthStore((state) => state.user);
  
  // Socket Hook
  const {
    isConnected,
    messages: socketMessages,
    typingUsers,
    startConversation,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    clearMessages,
  } = useChatSocket();

  // --- STATE ---
  const [conversationID, setConversationID] = useState<string | null>(initialConversationId || null);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasJoinedRef = useRef<string | false>(false); // Track room đã join

  // Hook Data
  const { 
    messages: dbMessages, 
    loading: isLoadingHistory, 
    hasMore,
    loadMore,
    setMessages: setDbMessages 
  } = useMessages(conversationID);

  // --- LOGIC 1: ĐỒNG BỘ PROP VÀO STATE ---
  useEffect(() => {
    // console.log('🔄 Syncing conversationId from prop:', initialConversationId);
    if (initialConversationId && initialConversationId !== conversationID) {
      setConversationID(initialConversationId);
      hasJoinedRef.current = false; // Reset joined flag
    }
  }, [initialConversationId]);

  // --- LOGIC 2: KHỞI TẠO CONVERSATION & JOIN SOCKET ROOM ---
  useEffect(() => {
    if (!visible || !user?._id || !recipient?._id) {
      // console.log('⏸️ ChatBox not ready:', { visible, userId: user?._id, recipientId: recipient?._id });
      return;
    }

    // ⚠️ QUAN TRỌNG: Chờ socket connected
    if (!isConnected) {
      // console.log('⏳ Waiting for socket connection...');
      return;
    }

    const initSocketRoom = async () => {
      try {
        setIsInitializing(true);
        let targetId = conversationID;

        // console.log('🚀 initSocketRoom:', { targetId, hasJoined: hasJoinedRef.current, isConnected });

        if (!targetId) {
          // console.log('🔄 Creating new conversation...');
          if(!user._id) return 
         const conv = await startConversation(user._id, recipient._id);
          if (conv?._id) {
            targetId = conv._id;
            setConversationID(conv._id);
            // console.log('✅ Created conversation:', conv._id);
          } else {
            // console.error('❌ Failed to create conversation');
            return;
          }
        }

        // Join room nếu chưa join hoặc join room khác
        if (targetId) {
          // Nếu đã join room khác, leave trước
          if (hasJoinedRef.current && hasJoinedRef.current !== targetId) {
            // console.log('🔄 Switching room, leaving old:', hasJoinedRef.current);
            leaveConversation(hasJoinedRef.current);
          }

          // Chỉ join nếu chưa join room này
          if (hasJoinedRef.current !== targetId) {
            // console.log('🔥 Joining conversation:', targetId);
            joinConversation(targetId);
            hasJoinedRef.current = targetId;
            // console.log('✅ ChatBox joined room:', targetId);
          } else {
            // console.log('ℹ️ Already joined room:', targetId);
          }
        }
      } catch (error) {
        console.error("❌ Lỗi khởi tạo chat:", error);
        message.error('Không thể kết nối chat');
      } finally {
        setIsInitializing(false);
      }
    };

    initSocketRoom();

    // Cleanup khi component unmount hoặc conversationID thay đổi
    return () => {
      if (hasJoinedRef.current && typeof hasJoinedRef.current === 'string') {
        // console.log('🔌 Leaving room:', hasJoinedRef.current);
        leaveConversation(hasJoinedRef.current);
        stopTyping(hasJoinedRef.current);
      }
    };
  }, [visible, user, recipient, conversationID, isConnected]); // ✅ Thêm isConnected vào deps

  // --- LOGIC 3: CLEANUP KHI ĐÓNG MODAL ---
  useEffect(() => {
    if (!visible) {
      // console.log('❌ Modal closed, cleaning up...');
      setInputValue('');
      clearMessages();
      hasJoinedRef.current = false;
      // ⚠️ KHÔNG reset conversationID ở đây, để parent component xử lý
    }
  }, [visible]);

  // --- LOGIC 4: SOCKET UPDATE ---
  useEffect(() => {
    if (socketMessages.length > 0) {
      // console.log('📨 Merging socket messages:', socketMessages.length);
      setDbMessages((prev) => {
        // Lọc duplicate messages
        const existingIds = new Set(prev.map(m => m._id));
        const newMessages = socketMessages.filter(m => !existingIds.has(m._id));
        return [...prev, ...newMessages];
      });
      clearMessages();
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [socketMessages]);

  // --- LOGIC 5: INFINITE SCROLL ---
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && !isLoadingHistory && hasMore) {
      const scrollHeightBefore = e.currentTarget.scrollHeight;
      await loadMore();
      setTimeout(() => {
        if (scrollContainerRef.current) {
           const scrollHeightAfter = scrollContainerRef.current.scrollHeight;
           scrollContainerRef.current.scrollTop = scrollHeightAfter - scrollHeightBefore;
        }
      }, 0);
    }
  };

  // Auto scroll lần đầu
  useEffect(() => {
    if (visible && dbMessages.length > 0 && dbMessages.length <= 20) {
       messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [visible, dbMessages]); 

  // --- HANDLERS ---
  const handleSend = async () => {
    if (!inputValue.trim() || !conversationID || isSending) return;
    try {
      setIsSending(true);
      await sendMessage(conversationID, inputValue.trim());
      setInputValue('');
      if (conversationID) stopTyping(conversationID);
    } catch (error) {
      console.error('❌ Send message error:', error);
      message.error('Không thể gửi tin nhắn');
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (conversationID) {
      startTyping(conversationID);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => stopTyping(conversationID), 2000);
    }
  };

  if (!recipient) return null;
  const isRecipientTyping = typingUsers.has(recipient._id);
  const safeMessages = Array.isArray(dbMessages) ? dbMessages : [];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={450}
      closeIcon={<X size={20} />}
      styles={{ body: { padding: 0, height: '600px', display: 'flex', flexDirection: 'column' } }}
      className="chat-modal"
      centered
      destroyOnClose
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white z-10">
        <Avatar src={recipient.avatar} icon={<User size={20} />} className="bg-orange-100" />
        <div className="flex-1">
          <Text strong>{recipient.fullName}</Text>
          <div className={`text-xs ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
            {isConnected ? 'Online' : 'Đang kết nối...'}
            {isInitializing && ' • Đang khởi tạo...'}
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3"
      >
        {isLoadingHistory && hasMore && (
           <div className="w-full flex justify-center py-2"><Spin size="small" /></div>
        )}

        {(isInitializing || !isConnected) && safeMessages.length === 0 ? (
          <div className="m-auto text-center text-gray-400">
            <Spin size="large" />
            <p className="mt-2">Đang kết nối...</p>
          </div>
        ) : safeMessages.length === 0 && !isLoadingHistory ? (
           <div className="m-auto text-center text-gray-400">
             <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
             <p>Hãy bắt đầu cuộc trò chuyện</p>
           </div>
        ) : (
          safeMessages.map((msg, index) => {
            const senderId = typeof msg.senderID === 'object' ? msg.senderID?._id : msg.senderID;
            const isMe = senderId === user?._id;
            const avatarUrl = typeof msg.senderID === 'object' ? msg.senderID?.avatar : recipient.avatar;

            return (
              <div key={msg._id || index} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                <Avatar src={isMe ? user?.avatar : avatarUrl} size={32} className={isMe ? "bg-orange-100" : "bg-blue-100"} icon={<User size={14}/>} />
                <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-orange-500 text-white' : 'bg-white shadow-sm'}`}>
                    {msg.type === 'Image' ? <img src={msg.content} className="max-w-full rounded" alt="img" /> : msg.content}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'}) : ''}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {isRecipientTyping && (
          <div className="flex gap-2 items-center text-gray-500 text-sm">
            <Avatar src={recipient.avatar} size={24} icon={<User size={12}/>} />
            <span className="italic">đang nhập...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-white flex gap-2 items-end">
         <Input.TextArea 
            value={inputValue} 
            onChange={handleInputChange} 
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Nhập tin nhắn..." 
            autoSize={{ minRows: 1, maxRows: 4 }} 
            className="rounded-xl"
            disabled={!isConnected || !conversationID || isInitializing}
         />
         <Button 
            type="primary" 
            onClick={handleSend} 
            disabled={!inputValue.trim() || isSending || !conversationID || !isConnected || isInitializing} 
            className="bg-orange-500 rounded-full h-8 w-8 p-0 flex items-center justify-center mb-1"
         >
            {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
         </Button>
      </div>
    </Modal>
  );
};

export default ChatBox;