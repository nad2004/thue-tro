import React, { useCallback } from 'react';
import { Tag, Button, Space, Tooltip, Popconfirm } from 'antd';
import { Typography } from 'antd';
import {
  Edit3,
  Trash2,
  Eye,
  MapPin,
  DollarSign,
  Maximize,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { Article } from '@/types/Article';

const { Text } = Typography;

interface ArticleTableRowProps {
  article: Article;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

const ArticleTableRow: React.FC<ArticleTableRowProps> = React.memo(
  ({ article, onDelete, onEdit, onView }) => {
    const handleDelete = useCallback(() => onDelete(article.id), [onDelete, article.id]);
    const handleEdit = useCallback(() => onEdit(article.id), [onEdit, article.id]);
    const handleView = useCallback(() => onView(article.id), [onView, article.id]);

    const getStatusConfig = (status: string) => {
      const configs = {
        Published: { color: 'success', label: 'Đang hiện', icon: '✅' },
        Pending: { color: 'processing', label: 'Chờ duyệt', icon: '⏳' },
        Draft: { color: 'warning', label: 'Nháp', icon: '📝' },
        Hidden: { color: 'default', label: 'Đã ẩn', icon: '👁️' },
        Rented: { color: 'error', label: 'Đã thuê', icon: '🏠' },
      };
      return (
        configs[status as keyof typeof configs] || { color: 'default', label: status, icon: '' }
      );
    };

    const statusConfig = getStatusConfig(article.status);

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    return (
      <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
        {/* Thumbnail + Info */}
        <div className="flex gap-4 flex-1 min-w-0">
          {/* Thumbnail */}
          <div className="w-32 h-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 shadow-sm group">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
            <div>
              <Text
                strong
                className="text-base line-clamp-1 hover:text-orange-600 cursor-pointer transition-colors"
                title={article.title}
                onClick={handleView}
              >
                {article.title}
              </Text>
              <div className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
                <MapPin size={14} className="shrink-0" />
                <span className="line-clamp-1">{article.summary || 'Chưa cập nhật địa chỉ'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <Tag
                color="blue"
                className="m-0 text-xs border-0 bg-blue-50 text-blue-700 px-3 py-0.5 rounded-full"
              >
                {article.categoryID?.categoryName || 'Chưa phân loại'}
              </Tag>
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Calendar size={12} />
                <span>{formatDate(article.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="hidden md:flex flex-col gap-2 w-32 shrink-0">
          <div className="flex items-center gap-1.5 text-orange-600 font-bold">
            <DollarSign size={16} />
            <span className="text-sm">{(article.price / 1000000).toFixed(1)}tr</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Maximize size={14} />
            <span className="text-sm">{article.area}m²</span>
          </div>
        </div>

        {/* Status */}
        <div className="hidden lg:block w-32 shrink-0">
          <Tag color={statusConfig.color} className="w-full text-center font-medium">
            <span className="mr-1">{statusConfig.icon}</span>
            {statusConfig.label}
          </Tag>
        </div>

        {/* Actions */}
        <div className="shrink-0">
          <Space size="small">
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                shape="circle"
                icon={<Eye size={18} className="text-gray-500" />}
                onClick={handleView}
                className="hover:bg-gray-100"
              />
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                shape="circle"
                icon={<Edit3 size={18} className="text-blue-600" />}
                onClick={handleEdit}
                className="hover:bg-blue-50"
              />
            </Tooltip>
            <Tooltip title="Xóa tin">
              <Popconfirm
                title="Xác nhận xóa"
                description="Bạn chắc chắn muốn xóa tin này? Hành động này không thể hoàn tác."
                onConfirm={handleDelete}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                icon={<AlertCircle className="text-red-500" size={20} />}
              >
                <Button
                  type="text"
                  shape="circle"
                  danger
                  icon={<Trash2 size={18} />}
                  className="hover:bg-red-50"
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        </div>
      </div>
    );
  },
);

ArticleTableRow.displayName = 'ArticleTableRow';

export default ArticleTableRow;
