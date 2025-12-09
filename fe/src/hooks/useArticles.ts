import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { ArticleService } from '@/services/Article.service';
import { CreateArticlePayload } from '@/types/Article';
import { QueryParams } from '@/types/api';

export const useArticles = (params: QueryParams = {}) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => ArticleService.getAll(params),
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => ArticleService.getById(id),
    enabled: !!id,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ArticleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      message.success('Tạo bài viết thành công');
    },
    onError: (e: any) =>
      message.error(e.response?.data?.message || 'Tạo thất bại'),
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string } & Partial<CreateArticlePayload>) =>
      ArticleService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: ['article', data.id] });
      }
      message.success('Cập nhật thành công');
    },
    onError: (e: any) =>
      message.error(e.response?.data?.message || 'Cập nhật thất bại'),
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ArticleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      message.success('Xóa bài viết thành công');
    },
    onError: (e: any) =>
      message.error(e.response?.data?.message || 'Xóa thất bại'),
  });
};
