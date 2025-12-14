import React, { useState } from 'react';
import { Button, Avatar, message } from 'antd';
import { MessageCircle, Phone, User } from 'lucide-react';
import { IUser } from '@/types/User';
import ChatBox from '@/components/ChatBox';
import { useAuthStore } from '@/store/auth-store';
import { useChatSocket } from '@/hooks/useChatSocket'; // ✅ Import thêm

interface QuickChatBarProps {
  author: IUser;
}

export default function QuickChatBar({ author }: QuickChatBarProps) {
  const [chatVisible, setChatVisible] = useState(false);
  const [conversationID, setConversationID] = useState<string | null>(null); // ✅ Thêm state
  const user = useAuthStore((state) => state.user);
  const { startConversation } = useChatSocket(); // ✅ Lấy hàm startConversation

  const handleCall = () => {
    if (author.phoneNumber) {
      window.location.href = `tel:${author.phoneNumber}`;
    } else {
      message.info('Số điện thoại chưa được cập nhật');
    }
  };

  // ✅ Sửa lại hàm handleChat
  const handleChat = async () => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để nhắn tin');
      return;
    }

    try {
      if(!user._id) return
      // Tạo hoặc lấy conversation trước khi mở ChatBox
      message.loading({ content: 'Đang mở chat...', key: 'chat-loading', duration: 0 });
      const conv = await startConversation(user._id, author._id);
      
      if (conv?._id) {
        setConversationID(conv._id);
        setChatVisible(true);
        message.destroy('chat-loading');
      }
    } catch (error) {
      console.error('Lỗi mở chat:', error);
      message.destroy('chat-loading');
      message.error('Không thể mở chat, vui lòng thử lại');
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] border-t border-gray-100 p-3 z-50 lg:hidden safe-area-bottom">
        <div className="flex items-center gap-3">
          {/* Author Info Mini */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar size="small" src={author.avatar} icon={<User size={12} />} />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase leading-none">Người đăng</span>
              <span className="font-semibold text-gray-800 truncate text-sm leading-tight">
                {author.fullName}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleChat}
              icon={<MessageCircle size={18} />}
              size="large"
              className="flex items-center justify-center border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100"
            />

            <Button
              type="primary"
              onClick={handleCall}
              icon={<Phone size={18} />}
              size="large"
              className="bg-[#ff7a00] hover:bg-[#ff7a00]/90 border-none shadow-sm flex items-center px-6 font-semibold"
            >
              Gọi ngay
            </Button>
          </div>
        </div>
      </div>

      {/* ChatBox Modal - ✅ Truyền conversationId */}
      <ChatBox
        visible={chatVisible}
        onClose={() => {
          setChatVisible(false);
          setConversationID(null); // ✅ Reset khi đóng
        }}
        recipient={author}
        conversationId={conversationID || undefined} // ✅ Truyền conversationId
      />
    </>
  );
}