import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { UserService } from '@/services/User.service';
import { QueryParams } from '@/types/api';
import { UserRole } from '@/types/User';
import { useAuthStore } from '@/store/auth-store';
export const useMyProfile = () => {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: UserService.getMyProfile,
    retry: 1,
  });
};

export const useSavedArticles = () => {
  return useQuery({
    queryKey: ['saved-articles'],
    queryFn: UserService.getSavedArticles,
  });
};

export const useToggleSaveArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UserService.toggleSaveArticle,
    onSuccess: (data, articleId) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
      queryClient.invalidateQueries({ queryKey: ['saved-articles'] });
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      message.success(data.saved ? 'Đã lưu tin vào bộ sưu tập' : 'Đã bỏ lưu tin');
    },
    onError: () => {
      message.error('Thao tác thất bại');
    },
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: UserService.updateAvatar,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      setAuth({ user: data });
      message.success('Cập nhật Avatar thành công');
    },
    onError: (e: any) => {
      message.error(e.response?.data?.message || 'Cập nhật Avatar thất bại');
    },
  });
};

export const useUsers = (params: QueryParams = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => UserService.getAll(params),
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => UserService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Cập nhật quyền thành công');
    },
    onError: (e: any) => message.error(e.response?.data?.message || 'Lỗi cập nhật'),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Đã xóa người dùng');
    },
    onError: (e: any) => message.error(e.response?.data?.message || 'Lỗi xóa người dùng'),
  });
};
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UserService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      message.success('Cập nhật thông tin thành công');
    },
    onError: (e: any) => {
      message.error(e.response?.data?.message || 'Cập nhật thất bại');
    },
  });
};
