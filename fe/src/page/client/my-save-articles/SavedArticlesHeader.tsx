import React from 'react';
import { Typography } from 'antd';
import { Heart, Bookmark } from 'lucide-react';

const { Title, Text } = Typography;

interface SavedArticlesHeaderProps {
  totalCount: number;
}

const SavedArticlesHeader: React.FC<SavedArticlesHeaderProps> = React.memo(({ totalCount }) => {
  return (
    <div className="bg-linear-to-r from-pink-500 to-rose-500 rounded-2xl p-6 md:p-8 mb-6 text-white shadow-xl">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
          <Bookmark size={28} />
        </div>
        <div className="flex-1">
          <Title level={2} className="text-white! mb-2!">
            Tin đã lưu
          </Title>
          <Text className="text-white/90 text-base">Quản lý các bất động sản bạn quan tâm</Text>
          <div className="mt-4 flex items-center gap-2">
            <div className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-2">
              <Heart size={16} />
              <span>{totalCount} tin đã lưu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SavedArticlesHeader.displayName = 'SavedArticlesHeader';

export default SavedArticlesHeader;
