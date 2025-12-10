import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { CategoryService } from '@/services/Category.service';
import { CreateCategoryPayload } from '@/types/Category';
import { QueryParams } from '@/types/api';

export const useCategories = (params: QueryParams = {}) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => CategoryService.getAll(params),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      message.success('Tạo danh mục thành công');
    },
    onError: (e: any) => message.error(e.response?.data?.message || 'Lỗi tạo danh mục'),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<CreateCategoryPayload>) =>
      CategoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      message.success('Cập nhật thành công');
    },
    onError: (e: any) => message.error(e.response?.data?.message || 'Lỗi cập nhật'),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      message.success('Xóa danh mục thành công');
    },
    onError: (e: any) => message.error(e.response?.data?.message || 'Lỗi xóa danh mục'),
  });
};
