// src/types/Article.ts

import { ICategory } from './Category';
import { ITag } from './Tag';
import { IUser } from './User';

export interface IArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  images: string[];
  price: number;
  area: number;
  status: string;
  categoryID: ICategory | null;
  tags: ITag[];
  authorID: IUser | null;
  createdAt: string;
  updatedAt: string;
}

// Payload để tạo/cập nhật bài viết (gửi qua FormData)
export interface CreateArticlePayload {
  title: string;
  summary: string;
  content: string;
  price: number;
  area: number;
  categoryID: string;
  tags?: string[]; // Array of tag IDs
  thumbnail?: File | Blob; // File object cho thumbnail
  images?: (File | Blob)[]; // Array of File objects cho images
  status?: string; // 'Published' | 'Draft' | 'Pending'
}

export class Article implements IArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  images: string[];
  price: number;
  area: number;
  status: string;
  categoryID: ICategory | null;
  tags: ITag[];
  authorID: IUser | null;
  createdAt: string;
  updatedAt: string;

  constructor(data: any) {
    this.id = data?.id || data?._id || '';
    this.title = data?.title || '';
    this.summary = data?.summary || '';
    this.content = data?.content || '';
    this.thumbnail = data?.thumbnail || '';
    this.images = data?.images || [];
    this.price = data?.price || 0;
    this.area = data?.area || 0;
    this.status = data?.status || 'Draft';

    // Map category
    this.categoryID = data?.categoryID
      ? {
          id: data.categoryID.id || data.categoryID._id,
          categoryName: data.categoryID.categoryName || data.categoryID.name,
          categorySlug: data.categoryID.categorySlug || data.categoryID.slug,
          description: data.categoryID.description || '',
          parentCategoryId: data.categoryID.parentCategoryId || null,
        }
      : null;

    // Map tags
    this.tags = Array.isArray(data?.tags)
      ? data.tags.map((tag: any) => ({
          id: tag.id || tag._id,
          tagName: tag.tagName || tag.name,
          tagSlug: tag.tagSlug || tag.slug,
        }))
      : [];

    // Map author
    this.authorID = data?.authorID
      ? {
          id: data.authorID.id || data.authorID._id,
          // username: data.author.username || "",
          email: data.authorID.email || '',
          fullName: data.authorID.fullName || '',
          avatar: data.authorID.avatar || data.authorID.avatar || '',
          phoneNumber: data.authorID.phoneNumber || '',
          role: data.authorID.role || 'Tenant',
          createdAt: data.authorID.createdAt || '',
        }
      : null;

    this.createdAt = data?.createdAt || new Date().toISOString();
    this.updatedAt = data?.updatedAt || new Date().toISOString();
  }

  // Helper method để tạo FormData từ payload
  static toFormData(payload: CreateArticlePayload): FormData {
    const formData = new FormData();

    formData.append('title', payload.title);
    formData.append('summary', payload.summary);
    formData.append('content', payload.content);
    formData.append('price', payload.price.toString());
    formData.append('area', payload.area.toString());
    formData.append('categoryID', payload.categoryID);

    if (payload.thumbnail) {
      formData.append('thumbnail', payload.thumbnail);
    }

    if (payload.tags && payload.tags.length > 0) {
      payload.tags.forEach((tagId) => {
        formData.append('tags', tagId);
      });
    }

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    if (payload.status) {
      formData.append('status', payload.status);
    }

    return formData;
  }
}
