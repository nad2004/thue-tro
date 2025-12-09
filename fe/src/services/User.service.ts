import axiosInstance from '@/lib/config/axios';
import { User, IUser, UserRole } from '@/types/User';
import { ApiResponse, QueryParams } from '@/types/api';

const ENDPOINT = '/user';

export const UserService = {
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
};
