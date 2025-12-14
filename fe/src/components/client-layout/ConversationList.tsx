import React from 'react';
import { List, Avatar, Badge, Typography, Empty, Spin } from 'antd';
import { User, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

const { Text } = Typography;
import { IConversation } from '@/types/Conversation';
interface ConversationListProps {
  conversations: IConversation[];
  loading: boolean;
  onSelectConversation: (conversation: IConversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  loading,
  onSelectConversation,
}) => {
  const user = useAuthStore((state) => state.user);

  const getOtherUser = (conversation: IConversation) => {
    return conversation.buyerID._id === user?.id
      ? conversation.ownerID
      : conversation.buyerID;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMs = now.getTime() - messageDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút`;
    if (diffInHours < 24) return `${diffInHours} giờ`;
    if (diffInDays < 7) return `${diffInDays} ngày`;
    
    return messageDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spin tip="Đang tải..." />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <Empty
        image={<MessageCircle size={48} className="text-gray-300 mx-auto" />}
        description={
          <span className="text-gray-500">
            Chưa có cuộc trò chuyện nào
          </span>
        }
        className="py-8"
      />
    );
  }

  return (
    <List
      className="conversation-list"
      dataSource={conversations}
      renderItem={(conversation) => {
        const otherUser = getOtherUser(conversation);
        const hasUnread = conversation.unreadCount > 0;

        return (
          <List.Item
            className="cursor-pointer hover:bg-gray-50 transition-colors px-4 py-3 border-none"
            onClick={() => onSelectConversation(conversation)}
            style={{ padding: '12px 16px' }}
          >
            <div className="flex items-center gap-3 w-full">
              <Badge
                count={conversation.unreadCount}
                size="small"
                offset={[-5, 5]}
              >
                <Avatar
                  src={otherUser.avatar}
                  icon={<User size={20} />}
                  size={48}
                  className="bg-orange-100"
                />
              </Badge>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <Text
                    strong={hasUnread}
                    className={`text-sm ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}
                  >
                    {otherUser.fullName}
                  </Text>
                  <Text
                    type="secondary"
                    className="text-xs"
                    style={{ fontWeight: hasUnread ? 600 : 400 }}
                  >
                    {formatTime(conversation.lastMessageTime)}
                  </Text>
                </div>

                <Text
                  type="secondary"
                  className="text-xs block truncate"
                  style={{
                    fontWeight: hasUnread ? 600 : 400,
                    color: hasUnread ? '#1f2937' : '#6b7280',
                  }}
                >
                  {conversation.lastMessageSnippet || 'Bắt đầu cuộc trò chuyện...'}
                </Text>
              </div>
            </div>
          </List.Item>
        );
      }}
    />
  );
};

export default ConversationList;