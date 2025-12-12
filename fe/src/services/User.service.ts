import axiosInstance from '@/lib/config/axios';
import { User, IUser, UserRole } from '@/types/User';
import { ApiResponse, QueryParams } from '@/types/api';
import { IArticleBackend } from '@/types/Article';

const ENDPOINT = '/user';

export const UserService = {
  getMyProfile: async (): Promise<IUser> => {
    const res = await axiosInstance.get<ApiResponse<IUser>>(`${ENDPOINT}/my-profile`);
    return res.data.data;
  },

  getSavedArticles: async (): Promise<IArticleBackend[]> => {
    const res = await axiosInstance.get<ApiResponse<any>>(`${ENDPOINT}/saved-articles`);
    return res.data.data.map((item: any) => ({
      ...item,
    }));
  },

  toggleSaveArticle: async (articleId: string): Promise<{ saved: boolean }> => {
    const res = await axiosInstance.post<ApiResponse<{ saved: boolean }>>(
      `${ENDPOINT}/save-article`,
      {
        articleId,
      },
    );
    return res.data.data;
  },

  updateAvatar: async (file: File): Promise<IUser> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await axiosInstance.post<ApiResponse<IUser>>(`${ENDPOINT}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return res.data.data;
  },

  getAll: async (params?: QueryParams): Promise<User[]> => {
    const res = await axiosInstance.get<ApiResponse<IUser[]>>(ENDPOINT, {
      params,
    });
    return (res.data.data || []).map((item) => new User(item));
  },

  updateRole: async (id: string, role: UserRole): Promise<void> => {
    await axiosInstance.put(`${ENDPOINT}/${id}`, { role });
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  },
  updateProfile: async (data: Partial<IUser>): Promise<IUser> => {
    const res = await axiosInstance.put<ApiResponse<IUser>>(`${ENDPOINT}/profile`, data);
    return res.data.data;
  },
};
