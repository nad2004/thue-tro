import axiosInstance from '@/lib/config/axios';
import { ApiResponse } from '@/types/api';
import { IUser } from '@/types/User';
import { LoginValues, RegisterValues } from '@/lib/utils/validation';

interface AuthResponse {
  token: string;
  data: IUser; // Backend trả về user info trong field 'data'
}

export const AuthService = {
  login: async (data: LoginValues): Promise<AuthResponse> => {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>('/user/login', data);
    return res.data.data; // Giả sử cấu trúc: { success: true, data: { token: "...", data: User } }
  },

  register: async (data: RegisterValues): Promise<AuthResponse> => {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>('/user/register', data);
    return res.data.data;
  },
};
