// src/types/api.ts

// Cấu trúc phản hồi chuẩn từ Backend
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  // Nếu backend trả về phân trang ở root level
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

// Cấu trúc tham số tìm kiếm, phân trang
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  categoryId?: string; // Lọc theo danh mục
  authorId?: string; // Lọc theo tác giả
  [key: string]: any; // Cho phép các tham số mở rộng khác
}
