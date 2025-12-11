import React from 'react';
import type { TablePaginationConfig } from 'antd/es/table';
import MyArticlesHeader from './MyArticlesHeader';
import ArticlesFilterBar from './ArticlesFilterBar';
import ArticlesTable from './ArticlesTable';
import { Article } from '@/types/Article';

interface MyArticlesListProps {
  articles: Article[];
  total: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  onTableChange: (pagination: TablePaginationConfig) => void;
  onSearch: (value: string) => void;
  onStatusChange: (status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onCreate: () => void;
}

const MyArticlesList: React.FC<MyArticlesListProps> = React.memo(({
  articles,
  total,
  loading,
  currentPage,
  pageSize,
  onTableChange,
  onSearch,
  onStatusChange,
  onDelete,
  onEdit,
  onView,
  onCreate,
}) => {
  // Calculate status counts (optional - có thể lấy từ API)

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <MyArticlesHeader 
          totalCount={total} 
          onCreate={onCreate} 
        />

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <ArticlesFilterBar
            onSearch={onSearch}
            onStatusChange={onStatusChange}
          />
        </div>

        {/* Articles Table */}
        <ArticlesTable
          articles={articles}
          total={total}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          onTableChange={onTableChange}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
        />
      </div>
    </div>
  );
});

MyArticlesList.displayName = 'MyArticlesList';

export default MyArticlesList;