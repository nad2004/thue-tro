import React, { useState, useCallback, useMemo } from 'react';
import {
  Card,
  Button,
  Tag as AntTag,
  Table,
} from 'antd';
import { 
  PlusOutlined, 
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

import ArticleForm from './ArticleForm';
import ArticleActions from './ArticleActions';
import ArticleStatusTag from './ArticleStatusTag';
import ArticleTableToolbar from './ArticleTableToolbar';
import {
  useArticles,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
  useApproveArticle,
} from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { Article, CreateArticlePayload } from '@/types/Article';
import { QueryParams } from '@/types/api';

const ArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. State quản lý Modal và Filters
  const [formVisible, setFormVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [filters, setFilters] = useState<QueryParams>({
    page: 1,
    limit: 10,
    search: '',
    categoryId: undefined,
  });

  // 2. Gọi Hooks React Query
  const { data, isLoading } = useArticles(filters);
  const { data: categories = [] } = useCategories();

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  const approveArticle = useApproveArticle();

  // 3. Handlers với useCallback
  const handleOpenForm = useCallback((articleRecord: Article | null = null) => {
    setEditingArticle(articleRecord);
    setFormVisible(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormVisible(false);
    setEditingArticle(null);
  }, []);

  const handleSubmit = useCallback(async (values: CreateArticlePayload) => {
    try {
      if (editingArticle) {
        await updateArticle.mutateAsync({ id: editingArticle.id, ...values });
      } else {
        await createArticle.mutateAsync(values);
      }
      handleCloseForm();
    } catch (error) {
      console.error(error);
    }
  }, [editingArticle, updateArticle, createArticle, handleCloseForm]);

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
    }));
  }, []);

  const handleSearch = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: value,
      page: 1,
    }));
  }, []);

  const handleView = useCallback((id: string) => {
    navigate(`/detail/${id}`);
  }, [navigate]);

  const handleEdit = useCallback((article: Article) => {
    handleOpenForm(article);
  }, [handleOpenForm]);

  const handleDelete = useCallback((id: string) => {
    deleteArticle.mutate(id);
  }, [deleteArticle]);

  const handleApprove = useCallback((id: string) => {
    approveArticle.mutate(id);
  }, [approveArticle]);

  // 4. Cấu hình cột cho Table (useMemo)
  const columns: ColumnsType<Article> = useMemo(() => [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      render: (text) => <span className="font-semibold text-gray-700">{text}</span>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryID',
      key: 'categoryID',
      render: (category) => (
        <AntTag color="blue">{category?.categoryName || 'Chưa phân loại'}</AntTag>
      ),
    },
    {
      title: 'Tác giả',
      dataIndex: 'authorID',
      key: 'authorID',
      render: (author) => (
        <span className="font-semibold text-gray-700">{author?.fullName || 'Ẩn danh'}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => <ArticleStatusTag status={status} />,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => (date ? new Date(date).toLocaleDateString('vi-VN') : '-'),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: 180,
      render: (_, record) => (
        <ArticleActions
          article={record}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApprove={handleApprove}
          showApprove={true}
        />
      ),
    },
  ], [handleView, handleEdit, handleDelete, handleApprove]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card
        title={<span className="text-lg font-bold">Quản lý Bài viết</span>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm()}>
            Viết bài mới
          </Button>
        }
        className="shadow-sm"
      >
        {/* --- Toolbar: Search & Filter --- */}
        <ArticleTableToolbar
          categories={categories}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
        />

        {/* --- Ant Design Table --- */}
        <Table
          columns={columns}
          dataSource={data?.articles || []}
          rowKey={(record) => record.id}
          loading={isLoading}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: data?.total || 0,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bài viết`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* --- Modal Form --- */}
      <ArticleForm
        visible={formVisible}
        onCancel={handleCloseForm}
        onSubmit={handleSubmit}
        loading={createArticle.isPending || updateArticle.isPending}
        initialValues={editingArticle}
      />
    </div>
  );
};

export default ArticlesPage;