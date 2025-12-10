import React, { useState } from 'react';
import { Card, Button, Form, Input, Modal, Table, Space, Popconfirm, Tooltip, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// Hooks & Models
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories';
import { Category, CreateCategoryPayload } from '@/types/Category';

const CategoriesPage: React.FC = () => {
  // 1. State
  const [formVisible, setFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  // 2. React Query Hooks
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // 3. Handlers
  const handleOpenForm = (categoryRecord: Category | null = null) => {
    setEditingCategory(categoryRecord);
    if (categoryRecord) {
      form.setFieldsValue({
        categoryName: categoryRecord.categoryName,
        categorySlug: categoryRecord.categorySlug,
      });
    } else {
      form.resetFields();
    }
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSubmit = async (values: CreateCategoryPayload) => {
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, ...values });
      } else {
        await createCategory.mutateAsync(values);
      }
      handleCloseForm();
    } catch (error) {
      // Lỗi đã được xử lý hiển thị bên trong hook (onError)
      console.error(error);
    }
  };

  // 4. Cấu hình Cột cho Table
  const columns: ColumnsType<Category> = [
    {
      title: 'Tên danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Slug',
      dataIndex: 'categorySlug',
      key: 'categorySlug',
      render: (text) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-600" />}
              onClick={() => handleOpenForm(record)}
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa danh mục này?"
              description="Hành động không thể hoàn tác"
              onConfirm={() => deleteCategory.mutate(record.id)}
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
    <div className="p-6">
      <Card
        title={<span className="text-lg font-bold">Quản lý Danh mục</span>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm()}>
            Thêm danh mục
          </Button>
        }
        className="shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={categories}
          rowKey={(record) => record.id} // Quan trọng: ID unique cho mỗi dòng
          loading={isLoading}
          pagination={{ pageSize: 10 }} // Phân trang client-side đơn giản cho danh mục
        />
      </Card>

      {/* Modal Form */}
      <Modal
        title={editingCategory ? 'Cập nhật danh mục' : 'Tạo danh mục mới'}
        open={formVisible}
        onCancel={handleCloseForm}
        onOk={() => form.submit()}
        confirmLoading={createCategory.isPending || updateCategory.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="categoryName"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Ví dụ: Công nghệ" />
          </Form.Item>

          <Form.Item
            name="categorySlug"
            label="Slug (URL)"
            help="Để trống sẽ tự động tạo từ tên danh mục"
          >
            <Input placeholder="cong-nghe" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
