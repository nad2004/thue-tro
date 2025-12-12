import { Card, Avatar, Button, Typography, Tag, message, Tooltip } from 'antd';
import { Phone, MessageCircle, User, CheckCircle2 } from 'lucide-react';
import { IUser } from '@/types/User';
const { Title, Text } = Typography;

interface OwnerInfoProps {
  author: IUser | null;
}

export default function OwnerInfo({ author }: OwnerInfoProps) {
  const [messageApi, contextHolder] = message.useMessage();
  if (!author) return null;

  // Placeholder data
  const displayPhone = '098 888 ****';
  const displayEmail = author.email;

  const handleCall = () => {
    // messageApi.info(`Vui lòng liên hệ qua email: ${displayEmail}`);
  };

  const handleChat = () => {
    // window.open(`mailto:${author.email}`, '_blank');
  };

  return (
    <Card
      bordered={false}
      className="shadow-md rounded-xl overflow-hidden"
      bodyStyle={{ padding: '24px' }}
    >
      {contextHolder}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-3">
          <Avatar
            size={80}
            src={author.avatar}
            icon={<User size={40} />}
            className="border-4 border-white shadow-sm bg-gray-200 flex items-center justify-center"
          />
          <Tooltip title="Đang hoạt động">
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          </Tooltip>
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
          className="h-12 flex items-center justify-center gap-2"
        >
          Chat với người bán
        </Button>
      </div>
    </Card>
  );
}
