// src/lib/axios.ts (hoặc src/axios.ts)

import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig, 
  AxiosResponse 
} from "axios";
import { useAuthStore } from "@/store/auth-store";

// 1. Định nghĩa URL API
const baseURL = "http://localhost:3000/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Zustand: Lấy token từ store
    const token = useAuthStore.getState().token;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về response.data để gọi API đỡ phải .data 2 lần (tuỳ chọn)
    // Nhưng để giữ chuẩn axios, ta cứ return response
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      // Dùng window.location để refresh cứng, hoặc dùng router navigate nếu component
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;