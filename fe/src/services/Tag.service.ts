import axiosInstance from '@/lib/config/axios';
import { Tag, ITag, CreateTagPayload } from '@/types/Tag';
import { ApiResponse, QueryParams } from '@/types/api';

const ENDPOINT = '/tags';

export const TagService = {
  getAll: async (params?: QueryParams): Promise<Tag[]> => {
    const res = await axiosInstance.get<ApiResponse<ITag[]>>(ENDPOINT, {
      params,
    });
    return (res.data.data || []).map((item) => new Tag(item));
  },

  create: async (data: CreateTagPayload): Promise<Tag> => {
    const res = await axiosInstance.post<ApiResponse<ITag>>(ENDPOINT, data);
    return new Tag(res.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  },
};
