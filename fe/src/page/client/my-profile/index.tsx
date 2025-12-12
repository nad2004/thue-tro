import React, { useState } from 'react';
import { Spin } from 'antd';
import { useMyProfile, useUpdateAvatar, useUpdateProfile } from '@/hooks/useUsers';
import MyProfileView from './MyProfileView';
import EditProfileModal from './EditProfileModal';
import { IUser } from '@/types/User';

/**
 * Container Component - Chứa logic và state management
 */
const MyProfileContainer: React.FC = () => {
  const { data: user, isLoading } = useMyProfile();
  const updateAvatar = useUpdateAvatar();
  const updateProfile = useUpdateProfile();

  const [uploading, setUploading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /**
   * Xử lý upload avatar
   */
  const handleAvatarUpload = async (file: File): Promise<boolean> => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      return false;
    }

    setUploading(true);
    try {
      await updateAvatar.mutateAsync(file);
      return true;
    } catch (error) {
      console.error('Upload failed:', error);
      return false;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Xử lý cập nhật thông tin profile
   */
  const handleUpdateProfile = async (values: Partial<IUser>) => {
    try {
      await updateProfile.mutateAsync(values);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Update profile failed:', error);
    }
  };

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  /**
   * Empty state
   */
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Không tìm thấy thông tin người dùng</p>
      </div>
    );
  }

  /**
   * Render Presentational Component
   */
  return (
    <>
      <MyProfileView
        user={user}
        uploading={uploading}
        onAvatarUpload={handleAvatarUpload}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      <EditProfileModal
        open={isEditModalOpen}
        user={user}
        loading={updateProfile.isPending}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProfile}
      />
    </>
  );
};

export default MyProfileContainer;
