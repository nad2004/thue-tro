// src/services/Article.service.ts

import axiosInstance from "@/lib/config/axios";
import { Article, IArticle, CreateArticlePayload } from "@/types/Article";
import { ApiResponse, QueryParams } from "@/types/api";

const ENDPOINT = "/articles";

// Định nghĩa kiểu trả về cho hàm getAll (bao gồm list và total)
interface GetAllArticlesResponse {
  articles: Article[];
  total: number;
}

export const ArticleService = {
 getAll: async (params?: QueryParams): Promise<GetAllArticlesResponse> => {
    // 1. Gọi API
    const response = await axiosInstance.get<any>(ENDPOINT, { params });
    // console.log("Raw API Response:", response);
    const responseBody = response.data ? response.data : response;
    const payloadData = responseBody.data || {};
    const rawList = Array.isArray(payloadData) ? payloadData : (payloadData.data || []);
    const total = payloadData.total || rawList.length || 0;

    // 4. Map sang Model
    const articles = rawList.map((item: any) => new Article(item));

    return { articles, total };
  },

  getById: async (id: string): Promise<Article> => {
    const response = await axiosInstance.get<ApiResponse<any>>(`${ENDPOINT}/${id}`);
    
    // Map dữ liệu thô thành Class Article
    return new Article(response.data.data);
  },

  /**
   * Tạo bài viết mới
   */
  create: async (payload: CreateArticlePayload): Promise<Article> => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINT, payload);
    return new Article(response.data.data);
  },

  /**
   * Cập nhật bài viết
   */
  update: async (id: string, payload: Partial<CreateArticlePayload>): Promise<Article> => {
    const response = await axiosInstance.put<ApiResponse<any>>(`${ENDPOINT}/${id}`, payload);
    return new Article(response.data.data);
  },

  /**
   * Xóa bài viết
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  }
};