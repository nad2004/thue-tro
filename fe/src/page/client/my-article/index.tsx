import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TablePaginationConfig } from 'antd/es/table';

// Import Hooks & Types
import { useMyArticles, useDeleteArticle } from '@/hooks/useArticles';
import { QueryParams } from '@/types/api';

// Import View Component
import MyArticlesList from './MyArticlesList';

const MyArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. State quản lý bộ lọc
  const [filters, setFilters] = useState<QueryParams>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
  });

  // 2. Fetch Data
  const { data, isLoading } = useMyArticles(filters);
  
  // 3. Mutation Xóa
  const deleteMutation = useDeleteArticle();

  // --- OPTIMIZED HANDLERS with useCallback ---

  // Khi thay đổi trang hoặc số lượng hiển thị
  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
    }));
  }, []);

  // Khi tìm kiếm
  const handleSearch = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  }, []);

  // Khi đổi tab trạng thái
  const handleStatusChange = useCallback((statusKey: string) => {
    setFilters((prev) => ({
      ...prev,
      status: statusKey || undefined,
      page: 1,
    }));
  }, []);

  // Xử lý Xóa
  const handleDelete = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  // Điều hướng
  const handleCreate = useCallback(() => {
    navigate('/my-article');
  }, [navigate]);

  const handleEdit = useCallback((id: string) => {
    navigate(`/edit-post/${id}`);
  }, [navigate]);

  const handleView = useCallback((id: string) => {
    navigate(`/detail/${id}`);
  }, [navigate]);

  return (
    <MyArticlesList
      // Data Props
      articles={data?.articles || []}
      total={data?.total || 0}
      loading={isLoading}
      currentPage={filters.page || 1}
      pageSize={filters.limit || 10}
      
      // Handler Props (all memoized)
      onTableChange={handleTableChange}
      onSearch={handleSearch}
      onStatusChange={handleStatusChange}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onView={handleView}
      onCreate={handleCreate}
    />
  );
};

export default MyArticlesPage;