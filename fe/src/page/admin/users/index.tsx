import React, { useState } from 'react';
import {
  Card,
  Table,
  Select,
  Tag,
  Popconfirm,
  Button,
  Avatar,
  Space,
  Tooltip,
  Typography,
  Input,
} from 'antd';
import { DeleteOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// Hooks & Models
import { useUsers, useUpdateUserRole, useDeleteUser } from '@/hooks/useUsers';
import { User, UserRole } from '@/types/User';
import { QueryParams } from '@/types/api';

const { Text } = Typography;

const UsersPage: React.FC = () => {
  // 1. State & Hooks
  const [filters, setFilters] = useState<QueryParams>({ page: 1, limit: 10, search: '' });

  const { data: users = [], isLoading } = useUsers(filters); // Giả sử hook trả về User[]
  const updateUserRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  // 2. Handlers
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUserRole.mutate({ id: userId, role: newRole });
  };

  const handleTableChange = (pagination: any) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };
  console.log(users);
  // 3. Cấu hình Cột
  const columns: ColumnsType<User> = [
    {
      title: 'Người dùng',
      key: 'user',
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} size="large" />
          <div className="flex flex-col">
            <Text strong>{record.fullName}</Text>
            <Text type="secondary" className="text-xs">
              @{record.id.slice(0, 6)}...
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <span className="text-gray-600">{email}</span>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      render: (role: UserRole, record) => (
        <Select
          defaultValue={role}
          style={{ width: 130 }}
          onChange={(val) => handleRoleChange(record.id, val)}
          disabled={updateUserRole.isPending}
          variant="filled" // Antd v5 style mới
        >
          <Select.Option value="Tenant">
            <Tag color="blue">Người Thuê</Tag>
          </Select.Option>
          <Select.Option value="Landlord">
            <Tag color="purple">Chủ Nhà</Tag>
          </Select.Option>
          <Select.Option value="Admin">
            <Tag color="red">Admin</Tag>
          </Select.Option>
        </Select>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt', // Giả sử model User có field này (hoặc created_at)
      key: 'createdAt',
      render: (date) => (date ? new Date(date).toLocaleDateString('vi-VN') : '-'),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Xóa người dùng">
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            description="Hành động này sẽ xóa vĩnh viễn người dùng."
            onConfirm={() => deleteUser.mutate(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card
        title={<span className="text-lg font-bold">Quản lý Người dùng</span>}
        className="shadow-sm"
      >
        {/* Toolbar */}
        <div className="mb-4 flex justify-between">
          <Input
            placeholder="Tìm theo tên, email..."
            prefix={<SearchOutlined className="text-gray-400" />}
            style={{ width: 300 }}
            onPressEnter={(e) => setFilters((prev) => ({ ...prev, search: e.currentTarget.value }))}
            allowClear
          />
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey={(record) => record.id}
          loading={isLoading}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: 50, // Nếu backend trả về total, hãy lấy từ data.total
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default UsersPage;
