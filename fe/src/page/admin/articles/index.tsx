import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Input,
  Select,
  Popconfirm,
  Tag as AntTag,
  Table,
  Tooltip,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';

import ArticleForm from './ArticleForm';
import {
  useArticles,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
} from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { Article, CreateArticlePayload } from '@/types/Article';
import { QueryParams } from '@/types/api';

const ArticlesPage: React.FC = () => {
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
  const { data, isLoading } = useArticles(filters); // data trả về { articles: Article[], total: number }
  const { data: categories = [] } = useCategories();

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  console.log('data:', data);
  // 3. Handlers
  const handleOpenForm = (articleRecord: Article | null = null) => {
    setEditingArticle(articleRecord);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingArticle(null);
  };

  const handleSubmit = async (values: CreateArticlePayload) => {
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
  };

  // Xử lý khi người dùng đổi trang trên Table Antd
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
    }));
  };

  // 4. Cấu hình cột cho Table Antd
  const columns: ColumnsType<Article> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      render: (text) => <span className="font-semibold text-gray-700">{text}</span>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'category',
      render: (text) => <AntTag color="blue">{text || 'Chưa phân loại'}</AntTag>,
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
      render: (status) => {
        const color =
          status === 'Published' ? 'success' : status === 'Draft' ? 'warning' : 'default';
        return <AntTag color={color}>{status}</AntTag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: Date) => (date ? new Date(date).toLocaleDateString('vi-VN') : '-'),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => handleOpenForm(record)}
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa bài viết?"
              description="Hành động này không thể hoàn tác."
              onConfirm={() => deleteArticle.mutate(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

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
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <Space>
            <Input
              placeholder="Tìm theo tiêu đề..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onPressEnter={(e) =>
                setFilters((prev) => ({ ...prev, search: e.currentTarget.value, page: 1 }))
              }
              style={{ width: 300 }}
              allowClear
            />
            <Select
              placeholder="Lọc danh mục"
              style={{ width: 200 }}
              allowClear
              onChange={(val) => setFilters((prev) => ({ ...prev, categoryId: val, page: 1 }))}
            >
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </div>

        {/* --- Ant Design Table --- */}
        <Table
          columns={columns}
          dataSource={data?.articles || []}
          rowKey={(record) => record.id} // Quan trọng: xác định key cho mỗi dòng
          loading={isLoading}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: data?.total || 0,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bài viết`,
          }}
          onChange={handleTableChange} // Xử lý phân trang server-side
          scroll={{ x: 800 }} // Cho phép scroll ngang trên mobile
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
