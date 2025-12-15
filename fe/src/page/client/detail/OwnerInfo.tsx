import { useState } from 'react';
import { Card, Avatar, Button, Typography, Tag, Tooltip, message } from 'antd';
import { Phone, MessageCircle, User, CheckCircle2 } from 'lucide-react';
import { IUser } from '@/types/User';
import ChatBox from '@/components/ChatBox';
import { useAuthStore } from '@/store/auth-store';
import { useChatSocket } from '@/hooks/useChatSocket'; // ✅ Import thêm

const { Title, Text } = Typography;

interface OwnerInfoProps {
  author: IUser | null;
}

export default function OwnerInfo({ author }: OwnerInfoProps) {
  const [chatVisible, setChatVisible] = useState(false);
  const [conversationID, setConversationID] = useState<string | null>(null); // ✅ Thêm state
  const user = useAuthStore((state) => state.user);
  const { startConversation } = useChatSocket(); // ✅ Lấy hàm startConversation
  if (!author) return null;

  const displayPhone = author.phoneNumber 
    ? `${author.phoneNumber.slice(0, 3)} ${author.phoneNumber.slice(3, 6)} ****`
    : '098 888 ****';

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
      <Card
        bordered={false}
        className="shadow-md rounded-xl overflow-hidden"
        bodyStyle={{ padding: '24px' }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <Avatar
              size={80}
              src={author.avatar}
              icon={<User size={40} />}
              className="border-4 border-white shadow-sm bg-gray-200 flex items-center justify-center"
            />
            {/* <Tooltip title="Đang hoạt động">
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </Tooltip> */}
          </div>

          <Title level={4} style={{ marginBottom: 4 }}>
            {author.fullName}
          </Title>

          {author.role === 'Landlord' && (
            <Tag color="success" icon={<CheckCircle2 size={12} />} className="m-0 rounded-full px-2">
              Chính chủ
            </Tag>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="primary"
            size="large"
            block
            icon={<Phone size={18} />}
            onClick={handleCall}
            className="bg-[#ff7a00] hover:bg-[#ff7a00]/90 border-[#ff7a00] h-12 font-semibold shadow-none flex items-center justify-center gap-2"
          >
            {displayPhone} · Hiện số
          </Button>

          <Button
            size="large"
            block
            icon={<MessageCircle size={18} />}
            onClick={handleChat}
            className="h-12 flex items-center justify-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Chat với người bán
          </Button>
        </div>
      </Card>

      {/* ChatBox Modal - ✅ Truyền conversationId */}
      {author && (
        <ChatBox
          visible={chatVisible}
          onClose={() => {
            setChatVisible(false);
            setConversationID(null); // ✅ Reset khi đóng
          }}
          recipient={author}
          conversationId={conversationID || undefined} // ✅ Truyền conversationId
        />
      )}
    </>
  );
}