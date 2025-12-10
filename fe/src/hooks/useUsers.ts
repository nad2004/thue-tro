import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { UserService } from '@/services/User.service';
import { QueryParams } from '@/types/api';
import { UserRole } from '@/types/User';

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
