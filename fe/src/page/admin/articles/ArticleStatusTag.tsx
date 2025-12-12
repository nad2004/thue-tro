import React from 'react';
import { Tag } from 'antd';

interface ArticleStatusTagProps {
  status: string;
}

const ArticleStatusTag: React.FC<ArticleStatusTagProps> = React.memo(({ status }) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      Published: { color: 'success', label: 'Đã xuất bản' },
      Pending: { color: 'processing', label: 'Chờ duyệt' },
      Draft: { color: 'warning', label: 'Bản nháp' },
      Hidden: { color: 'default', label: 'Đã ẩn' },
      Rented: { color: 'error', label: 'Đã thuê' },
    };
    return configs[status as keyof typeof configs] || { color: 'default', label: status };
  };

  const config = getStatusConfig(status);

  return (
    <Tag color={config.color} className="font-medium">
      {config.label}
    </Tag>
  );
});

ArticleStatusTag.displayName = 'ArticleStatusTag';

export default ArticleStatusTag;
