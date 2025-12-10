import axiosInstance from '@/lib/config/axios';
import { Category, ICategory, CreateCategoryPayload } from '@/types/Category';
import { ApiResponse, QueryParams } from '@/types/api';

const ENDPOINT = '/categories';

export const CategoryService = {
  getAll: async (params?: QueryParams): Promise<Category[]> => {
    const res = await axiosInstance.get<ApiResponse<ICategory[]>>(ENDPOINT, {
      params,
    });
    return (res.data.data || []).map((item) => new Category(item));
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const res = await axiosInstance.post<ApiResponse<ICategory>>(ENDPOINT, payload);
    return new Category(res.data.data);
  },

  update: async (id: string, payload: Partial<CreateCategoryPayload>): Promise<Category> => {
    const res = await axiosInstance.put<ApiResponse<ICategory>>(`${ENDPOINT}/${id}`, payload);
    return new Category(res.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  },
};
