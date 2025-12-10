import { z } from 'zod';

// ==========================================
// AUTHENTICATION
// ==========================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// 🌟 Tự động tạo Type từ Schema
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ và Tên phải có ít nhất 2 ký tự.'),
  userName: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự.'),
  email: z.string().email('Email không hợp lệ.'),
  // 👇 THÊM DÒNG NÀY
  phoneNumber: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số.')
    .max(11, 'Số điện thoại không quá 11 số.')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa ký tự số.'),
  // ----------------
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
});

export type RegisterValues = z.infer<typeof registerSchema>;

// ==========================================
// NEWS / ARTICLES
// ==========================================

export const createNewsSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  content: z.string().min(20, 'Nội dung phải có ít nhất 20 ký tự'),
  excerpt: z.string().min(10, 'Đoạn trích phải có ít nhất 10 ký tự'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).optional(), // Hoặc z.array(z.object({ id: z.string(), text: z.string() })) tuỳ UI tag input
});

export type CreateNewsValues = z.infer<typeof createNewsSchema>;

// ==========================================
// CATEGORY
// ==========================================

export const categorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
  slug: z.string().min(2, 'Slug phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
});

export type CategoryValues = z.infer<typeof categorySchema>;
