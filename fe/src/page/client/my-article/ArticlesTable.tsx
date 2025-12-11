import React from 'react';
import { Pagination, Empty, Spin, Card } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import ArticleTableRow from './ArticleTableRow';
import { Article } from '@/types/Article';

interface ArticlesTableProps {
  articles: Article[];
  total: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  onTableChange: (pagination: TablePaginationConfig) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

const ArticlesTable: React.FC<ArticlesTableProps> = React.memo(({
  articles,
  total,
  loading,
  currentPage,
  pageSize,
  onTableChange,
  onDelete,
  onEdit,
  onView,
}) => {
  const handlePaginationChange = (page: number, size: number) => {
    onTableChange({ current: page, pageSize: size });
  };

  if (loading) {
    return (
      <Card className="shadow-sm border-gray-100 rounded-xl">
        <div className="flex items-center justify-center py-20">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </Card>
    );
  }

  if (articles.length === 0) {
    return (
      <Card className="shadow-sm border-gray-100 rounded-xl">
        <div className="py-20">
          <Empty 
            description={
              <div className="text-center">
                <p className="text-gray-600 text-base mb-2">Bạn chưa có tin đăng nào</p>
                <p className="text-gray-400 text-sm">Hãy bắt đầu đăng tin để cho thuê phòng trọ của bạn</p>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-100 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          {articles.map((article) => (
            <ArticleTableRow
              key={article.id}
              article={article}
              onDelete={onDelete}
              onEdit={onEdit}
              onView={onView}
            />
          ))}
        </div>
      </Card>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex justify-center md:justify-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showTotal={(total, range) => (
              <span className="text-gray-600">
                Hiển thị {range[0]}-{range[1]} trong tổng {total} tin
              </span>
            )}
            onChange={handlePaginationChange}
            pageSizeOptions={['10', '20', '50', '100']}
            className="[&_.ant-pagination-item-active]:bg-orange-500 [&_.ant-pagination-item-active]:border-orange-500"
          />
        </div>
      )}
    </div>
  );
});

ArticlesTable.displayName = 'ArticlesTable';

export default ArticlesTable;