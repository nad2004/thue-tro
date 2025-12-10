import React, { useState } from 'react';
import {
  Card,
  Button,
  Form,
  Input,
  Modal,
  Tag as AntTag,
  Table,
  Space,
  Popconfirm,
  Tooltip,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// Hooks & Models
import { useTags, useCreateTag, useDeleteTag } from '@/hooks/useTags';
import { Tag, CreateTagPayload } from '@/types/Tag';

const TagsPage: React.FC = () => {
  // 1. State & Hooks
  const [formVisible, setFormVisible] = useState(false);
  const [form] = Form.useForm();

  const { data: tags = [], isLoading } = useTags();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();

  // 2. Handlers
  const handleOpenForm = () => {
    form.resetFields();
    setFormVisible(true);
  };

  const handleSubmit = async (values: CreateTagPayload) => {
    try {
      await createTag.mutateAsync(values);
      setFormVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  // 3. Cấu hình cột Table
  const columns: ColumnsType<Tag> = [
    {
      title: 'Tên thẻ',
      dataIndex: 'tagName',
      key: 'tagName',
      render: (text: string) => <AntTag color="blue">#{text}</AntTag>,
    },
    {
      title: 'Slug',
      dataIndex: 'tagSlug',
      key: 'tagSlug',
      render: (text: string) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xóa thẻ">
            <Popconfirm
              title="Xóa thẻ này?"
              description="Hành động này không thể hoàn tác."
              onConfirm={() => deleteTag.mutate(record.id)}
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
        title={<span className="text-lg font-bold">Quản lý Thẻ (Tags)</span>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenForm}>
            Thêm thẻ mới
          </Button>
        }
        className="shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={tags}
          rowKey={(record) => record.id} // Quan trọng: Unique key cho mỗi dòng
          loading={isLoading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      {/* Modal Tạo Thẻ */}
      <Modal
        title="Tạo thẻ mới"
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={createTag.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="tagName"
            label="Tên thẻ"
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
          >
            <Input placeholder="Ví dụ: Nội thất, Giá rẻ..." />
          </Form.Item>

          <Form.Item
            name="tagSlug"
            label="Slug (Tùy chọn)"
            help="Để trống sẽ tự động tạo từ tên thẻ"
          >
            <Input placeholder="noi-that" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagsPage;
