// src/services/Article.service.ts

import axiosInstance from '@/lib/config/axios';
import { Article, CreateArticlePayload } from '@/types/Article';
import { ApiResponse, QueryParams } from '@/types/api';

const ENDPOINT = '/articles';

interface GetAllArticlesResponse {
  articles: Article[];
  total: number;
}

export const ArticleService = {
  // --- 1. LẤY TẤT CẢ (Dành cho trang chủ / Admin) ---
  getAll: async (params?: QueryParams): Promise<GetAllArticlesResponse> => {
    const response = await axiosInstance.get<any>(ENDPOINT, { params });
    
    // Logic parse response giữ nguyên như file cũ của bạn
    const responseBody = response.data ? response.data : response;
    const payloadData = responseBody.data || {};
    const rawList = Array.isArray(payloadData) ? payloadData : payloadData.data || [];
    const total = payloadData.total || rawList.length || 0;
    const articles = rawList.map((item: any) => new Article(item));

    return { articles, total };
  },

  // --- 2. LẤY BÀI CỦA TÔI (API MỚI) ---
  getMyArticles: async (params?: QueryParams): Promise<GetAllArticlesResponse> => {
    // Gọi vào endpoint /my-articles
    const response = await axiosInstance.get<any>(`${ENDPOINT}/my-articles`, { params });
    
    const responseBody = response.data ? response.data : response;
    const payloadData = responseBody.data || {};
    const rawList = Array.isArray(payloadData) ? payloadData : payloadData.data || [];
    const total = payloadData.total || rawList.length || 0;
    const articles = rawList.map((item: any) => new Article(item));

    return { articles, total };
  },

  // --- 3. DUYỆT BÀI (API MỚI - ADMIN) ---
  approve: async (id: string): Promise<void> => {
    await axiosInstance.patch(`${ENDPOINT}/${id}/approve`);
  },

  getById: async (id: string): Promise<Article> => {
    const response = await axiosInstance.get<ApiResponse<any>>(`${ENDPOINT}/${id}`);
    return new Article(response.data.data);
  },

  create: async (payload: CreateArticlePayload): Promise<Article> => {
    const formData = Article.toFormData(payload); // Giả sử bạn đã có static method toFormData trong Class Article
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // Tăng timeout cho upload ảnh
    });
    return new Article(response.data.data);
  },

  update: async (id: string, payload: Partial<CreateArticlePayload>): Promise<Article> => {
    const formData = Article.toFormData(payload as CreateArticlePayload);
    const response = await axiosInstance.put<ApiResponse<any>>(`${ENDPOINT}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return new Article(response.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  },
};