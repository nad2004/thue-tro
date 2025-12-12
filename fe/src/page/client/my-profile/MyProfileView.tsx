import React from 'react';
import { Card, Avatar, Button, Descriptions, Tag, Upload } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CameraOutlined,
  HomeOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { IUser } from '@/types/User';

interface MyProfileViewProps {
  user: IUser;
  uploading: boolean;
  onAvatarUpload: (file: File) => Promise<boolean>;
  onEditClick: () => void;
}

/**
 * Presentational Component - Chỉ hiển thị UI
 */
const MyProfileView: React.FC<MyProfileViewProps> = ({
  user,
  uploading,
  onAvatarUpload,
  onEditClick,
}) => {
  /**
   * Helper: Lấy màu theo role
   */
  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      Admin: 'red',
      Landlord: 'orange',
      Tenant: 'blue',
    };
    return colors[role] || 'default';
  };

  /**
   * Helper: Lấy text tiếng Việt theo role
   */
  const getRoleText = (role: string): string => {
    const texts: Record<string, string> = {
      Admin: 'Quản trị viên',
      Landlord: 'Chủ nhà',
      Tenant: 'Người thuê',
    };
    return texts[role] || role;
  };

  /**
   * Upload handler
   */
  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    await onAvatarUpload(file);
    return false; // Prevent auto upload
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card - Avatar & Name */}
        <Card
          className="mb-6 shadow-lg rounded-2xl overflow-hidden border-0"
          bodyStyle={{ padding: 0 }}
        >
          <div
            className="flex flex-col items-center text-white py-8 px-4"
            style={{
              background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
            }}
          >
            {/* Avatar with Upload Button */}
            <div className="relative mb-4">
              <Avatar
                size={120}
                src={user.avatar}
                icon={<UserOutlined />}
                className="border-4 border-white shadow-xl"
              />
              <Upload showUploadList={false} beforeUpload={handleBeforeUpload} accept="image/*">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CameraOutlined />}
                  loading={uploading}
                  className="absolute bottom-0 right-0 shadow-lg"
                  style={{
                    background: 'white',
                    color: '#FF6B35',
                    border: 'none',
                  }}
                />
              </Upload>
            </div>

            {/* Name & Role */}
            <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
            <Tag color={getRoleColor(user.role)} className="text-base px-4 py-1">
              {getRoleText(user.role)}
            </Tag>
          </div>
        </Card>

        {/* Info Card */}
        <Card
          title={
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold text-gray-800">Thông tin cá nhân</span>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={onEditClick}
                style={{
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                  border: 'none',
                }}
              >
                Chỉnh sửa
              </Button>
            </div>
          }
          className="shadow-lg rounded-2xl border-0"
        >
          <Descriptions column={1}>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600">
                  <UserOutlined className="text-orange-500" />
                  Họ và tên
                </span>
              }
            >
              <span className="font-medium text-gray-800">{user.fullName}</span>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600">
                  <MailOutlined className="text-orange-500" />
                  Email
                </span>
              }
            >
              <span className="font-medium text-gray-800">{user.email}</span>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600">
                  <PhoneOutlined className="text-orange-500" />
                  Số điện thoại
                </span>
              }
            >
              <span className="font-medium text-gray-800">{user.phoneNumber}</span>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600">
                  <HomeOutlined className="text-orange-500" />
                  Tin đã lưu
                </span>
              }
            >
              <span className="font-medium text-gray-800">
                {user.savedArticles?.length || 0} tin
              </span>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600">
                  <UserOutlined className="text-orange-500" />
                  Ngày tham gia
                </span>
              }
            >
              <span className="font-medium text-gray-800">
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Stats Cards - Only for Landlord */}
        {user.role === 'Landlord' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="shadow-lg rounded-2xl text-center hover:shadow-xl transition-shadow border-0">
              <div className="text-3xl font-bold text-orange-500">
                {user.savedArticles?.length || 0}
              </div>
              <div className="text-gray-600 mt-2">Tin đã đăng</div>
            </Card>

            <Card className="shadow-lg rounded-2xl text-center hover:shadow-xl transition-shadow border-0">
              <div className="text-3xl font-bold text-blue-500">0</div>
              <div className="text-gray-600 mt-2">Lượt xem</div>
            </Card>

            <Card className="shadow-lg rounded-2xl text-center hover:shadow-xl transition-shadow border-0">
              <div className="text-3xl font-bold text-green-500">0</div>
              <div className="text-gray-600 mt-2">Liên hệ</div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfileView;
