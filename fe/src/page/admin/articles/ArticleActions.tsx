import React, { useCallback } from 'react';
import { Button, Space, Tooltip, Popconfirm } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Article } from '@/types/Article';

interface ArticleActionsProps {
  article: Article;
  onView: (id: string) => void;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onApprove?: (id: string) => void;
  showApprove?: boolean;
}

const ArticleActions: React.FC<ArticleActionsProps> = React.memo(({
  article,
  onView,
  onEdit,
  onDelete,
  onApprove,
  showApprove = false,
}) => {
  const handleView = useCallback(() => {
    onView(article.id);
  }, [onView, article.id]);

  const handleEdit = useCallback(() => {
    onEdit(article);
  }, [onEdit, article]);

  const handleDelete = useCallback(() => {
    onDelete(article.id);
  }, [onDelete, article.id]);

  const handleApprove = useCallback(() => {
    onApprove?.(article.id);
  }, [onApprove, article.id]);

  return (
    <Space size="small">
      {/* View Button */}
      {/* <Tooltip title="Xem chi tiết">
        <Button
          type="text"
          icon={<EyeOutlined className="text-gray-500" />}
          onClick={handleView}
        />
      </Tooltip> */}

      {/* Approve Button - Only show for Pending articles */}
      {showApprove && article.status === 'Pending' && onApprove && (
        <Tooltip title="Duyệt bài">
          <Popconfirm
            title="Duyệt bài viết?"
            description="Bài viết sẽ được công khai sau khi duyệt."
            onConfirm={handleApprove}
            okText="Duyệt"
            cancelText="Hủy"
            okButtonProps={{ type: 'primary' }}
          >
            <Button
              type="text"
              icon={<CheckCircleOutlined className="text-green-600" />}
            />
          </Popconfirm>
        </Tooltip>
      )}

      {/* Edit Button */}
      <Tooltip title="Chỉnh sửa">
        <Button
          type="text"
          icon={<EditOutlined className="text-blue-500" />}
          onClick={handleEdit}
        />
      </Tooltip>

      {/* Delete Button */}
      <Tooltip title="Xóa">
        <Popconfirm
          title="Xóa bài viết?"
          description="Hành động này không thể hoàn tác."
          onConfirm={handleDelete}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Tooltip>
    </Space>
  );
});

ArticleActions.displayName = 'ArticleActions';

export default ArticleActions;