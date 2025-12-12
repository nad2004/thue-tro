export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  categoryId?: string;
  authorId?: string;
  [key: string]: any;
}
