import React, { useCallback } from 'react';
import { Card, Tag, Button, Tooltip } from 'antd';
import { Typography } from 'antd';
import { MapPin, DollarSign, Maximize, Heart, Eye, Calendar, User } from 'lucide-react';
import { IArticleBackend } from '@/types/Article';

const { Text } = Typography;

interface SavedArticleCardProps {
  article: IArticleBackend;
  onUnsave: (id: string) => void;
  onView: (id: string) => void;
}

const SavedArticleCard: React.FC<SavedArticleCardProps> = React.memo(
  ({ article, onUnsave, onView }) => {
    const handleUnsave = useCallback(() => {
      onUnsave(article._id);
    }, [onUnsave, article._id]);

    const handleView = useCallback(() => {
      onView(article._id);
    }, [onView, article._id]);

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    return (
      <Card
        hoverable
        className="group overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image */}
          <div className="relative w-full md:w-64 h-48 md:h-40 shrink-0 overflow-hidden rounded-xl group-hover:shadow-lg transition-shadow">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Heart Button Overlay */}
            <div className="absolute top-3 right-3">
              <Tooltip title="Bỏ lưu">
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  icon={<Heart size={18} className="fill-current" />}
                  onClick={handleUnsave}
                  className="shadow-lg hover:scale-110 transition-transform"
                />
              </Tooltip>
            </div>

            {/* Price Tag */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
              <div className="flex items-center gap-1 text-orange-600 font-bold">
                <DollarSign size={16} />
                <span>{(article.price / 1000000).toFixed(1)}tr</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              {/* Title */}
              <Text
                strong
                className="text-lg line-clamp-2 hover:text-pink-600 cursor-pointer transition-colors mb-2 block"
                onClick={handleView}
              >
                {article.title}
              </Text>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                <MapPin size={14} className="shrink-0" />
                <span className="line-clamp-1">{article.summary || 'Chưa cập nhật địa chỉ'}</span>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Tag color="blue" className="m-0 rounded-full px-3">
                  {article.categoryID?.categoryName || 'Chưa phân loại'}
                </Tag>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Maximize size={14} />
                  <span className="text-sm">{article.area}m²</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <Calendar size={12} />
                  <span className="text-xs">{formatDate(article.createdAt)}</span>
                </div>
              </div>

              {/* Author */}
              {article.authorID && (
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={14} />
                  <span className="text-sm">{article.authorID.fullName}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <Button
                type="primary"
                icon={<Eye size={16} />}
                onClick={handleView}
                className="bg-pink-500 hover:bg-pink-600 border-none rounded-lg"
              >
                Xem chi tiết
              </Button>
              <Button danger onClick={handleUnsave} className="rounded-lg">
                Bỏ lưu
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  },
);

SavedArticleCard.displayName = 'SavedArticleCard';

export default SavedArticleCard;
