// src/hooks/useArticles.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { ArticleService } from '@/services/Article.service';
import { CreateArticlePayload } from '@/types/Article';
import { QueryParams } from '@/types/api';

// Hook lấy tất cả bài viết
export const useArticles = (params: QueryParams = {}) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => ArticleService.getAll(params),
  });
};

// --- HOOK MỚI: LẤY BÀI VIẾT CỦA TÔI ---
export const useMyArticles = (params: QueryParams = {}) => {
  return useQuery({
    queryKey: ['my-articles', params],
    queryFn: () => ArticleService.getMyArticles(params),
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => ArticleService.getById(id),
    enabled: !!id,
  });
};

// --- HOOK MỚI: DUYỆT BÀI VIẾT ---
export const useApproveArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ArticleService.approve,
    onSuccess: () => {
      // Làm mới cả danh sách chung và danh sách cá nhân
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      message.success('Đã duyệt bài viết thành công');
    },
    onError: (e: any) => message.error(e.response?.data?.message || 'Duyệt thất bại'),
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ArticleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['my-articles'] }); // Refresh list của tôi
      message.success('Tạo bài viết thành công');
    },
    onError: (e: any) => message.error(e.response?.data?.message || 'Tạo thất bại'),
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<CreateArticlePayload>) =>
      ArticleService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: ['article', data.id] });
      }
      message.success('Cập nhật thành công');
    },
    onError: (e: any) => message.error(e.response?.data?.message || 'Cập nhật thất bại'),
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ArticleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      message.success('Xóa bài viết thành công');
    },
    onError: (e: any) => message.error(e.response?.data?.message || 'Xóa thất bại'),
  });
};