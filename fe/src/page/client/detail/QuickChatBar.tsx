import React from 'react';
import { Button, message, Avatar } from 'antd';
import { MessageCircle, Phone, User } from 'lucide-react';
import { IUser } from '@/types/User';

interface QuickChatBarProps {
    author: IUser;
}

export default function QuickChatBar({ author }: QuickChatBarProps) {
  const [messageApi, contextHolder] = message.useMessage();

  const handleCall = () => {
     messageApi.open({
       type: 'info',
       content: `Liên hệ email: ${author.email}`,
       icon: <Phone size={18} color="#ff7a00" />,
     });
  };

  const handleChat = () => {
    messageApi.success('Đang chuyển đến hộp thoại chat...');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] border-t border-gray-100 p-3 z-50 lg:hidden safe-area-bottom">
      {contextHolder}
      <div className="flex items-center gap-3">
        {/* Author Info Mini */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
           <Avatar size="small" src={author.avatar} icon={<User size={12} />} />
           <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase leading-none">Người đăng</span>
              <span className="font-semibold text-gray-800 truncate text-sm leading-tight">{author.fullName}</span>
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
  );
}