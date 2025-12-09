import axiosInstance from "@/lib/config/axios";
import { ApiResponse } from "@/types/api";

const ENDPOINT = "/comments";

export const CommentService = {
  getByArticle: async (articleId: string): Promise<any[]> => {
    const res = await axiosInstance.get<ApiResponse<any[]>>(`${ENDPOINT}/article/${articleId}`);
    return res.data.data || [];
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  }
};