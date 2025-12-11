import React from 'react';
import { Button, Typography } from 'antd';
import { Plus, Sparkles } from 'lucide-react';

const { Title, Text } = Typography;

interface MyArticlesHeaderProps {
  totalCount: number;
  onCreate: () => void;
}

const MyArticlesHeader: React.FC<MyArticlesHeaderProps> = React.memo(({ 
  totalCount, 
  onCreate 
}) => {
  return (
    <div className="bg-linear-to-r from-orange-500 to-pink-500 rounded-2xl p-6 md:p-8 mb-6 text-white shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
            <Sparkles size={28} />
          </div>
          <div>
            <Title level={2} className="text-white! mb-2!">
              Quản lý tin đăng
            </Title>
            <Text className="text-white/90 text-base">
              Quản lý tất cả các bất động sản bạn đang cho thuê
            </Text>
            <div className="mt-3 flex items-center gap-2">
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                📊 Tổng: {totalCount} tin
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          type="primary"
          size="large" 
          icon={<Plus size={20} />} 
          onClick={onCreate}
          className="bg-white! text-orange-600! hover:bg-orange-50! border-none! h-12! px-6! font-semibold! rounded-xl! shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
        >
          Đăng tin mới
        </Button>
      </div>
    </div>
  );
});

MyArticlesHeader.displayName = 'MyArticlesHeader';

export default MyArticlesHeader;