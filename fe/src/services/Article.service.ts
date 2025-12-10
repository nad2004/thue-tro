// src/services/Article.service.ts

import axiosInstance from '@/lib/config/axios';
import { Article, IArticle, CreateArticlePayload } from '@/types/Article';
import { ApiResponse, QueryParams } from '@/types/api';

const ENDPOINT = '/articles';

// Định nghĩa kiểu trả về cho hàm getAll (bao gồm list và total)
interface GetAllArticlesResponse {
  articles: Article[];
  total: number;
}

export const ArticleService = {
  getAll: async (params?: QueryParams): Promise<GetAllArticlesResponse> => {
    // 1. Gọi API
    const response = await axiosInstance.get<any>(ENDPOINT, { params });
    const responseBody = response.data ? response.data : response;
    const payloadData = responseBody.data || {};
    const rawList = Array.isArray(payloadData) ? payloadData : payloadData.data || [];
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
   * Tạo bài viết mới (multipart/form-data)
   */
  create: async (payload: CreateArticlePayload): Promise<Article> => {
    const formData = new FormData();

    // Append các field required
    formData.append('title', payload.title);
    formData.append('summary', payload.summary);
    formData.append('content', payload.content);
    formData.append('price', payload.price.toString());
    formData.append('area', payload.area.toString());
    formData.append('categoryID', payload.categoryID);

    // Append thumbnail (file)
    if (payload.thumbnail) {
      formData.append('thumbnail', payload.thumbnail);
    }

    // Append tags array (nếu có)
    if (payload.tags && payload.tags.length > 0) {
      payload.tags.forEach((tagId) => {
        formData.append('tags', tagId);
      });
    }

    // Append images array (nếu có)
    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    // Append status (nếu có)
    if (payload.status) {
      formData.append('status', payload.status);
    }

    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return new Article(response.data.data);
  },

  /**
   * Cập nhật bài viết (multipart/form-data)
   */
  update: async (id: string, payload: Partial<CreateArticlePayload>): Promise<Article> => {
    const formData = new FormData();

    // Append các field có giá trị
    if (payload.title) {
      formData.append('title', payload.title);
    }

    if (payload.summary) {
      formData.append('summary', payload.summary);
    }

    if (payload.content) {
      formData.append('content', payload.content);
    }

    if (payload.price !== undefined) {
      formData.append('price', payload.price.toString());
    }

    if (payload.area !== undefined) {
      formData.append('area', payload.area.toString());
    }

    if (payload.categoryID) {
      formData.append('categoryID', payload.categoryID);
    }

    if (payload.status) {
      formData.append('status', payload.status);
    }

    // Append thumbnail mới (nếu có)
    if (payload.thumbnail) {
      formData.append('thumbnail', payload.thumbnail);
    }

    // Append tags array (nếu có)
    if (payload.tags && payload.tags.length > 0) {
      payload.tags.forEach((tagId) => {
        formData.append('tags', tagId);
      });
    }

    // Append images mới (nếu có)
    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await axiosInstance.put<ApiResponse<any>>(`${ENDPOINT}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return new Article(response.data.data);
  },

  /**
   * Xóa bài viết
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  },
};
