// src/models/Article.ts

import { IUser, User } from './User'; // Giả sử bạn có class User tương tự Category
import { ICategory, Category } from './Category';
import { ITag, Tag } from './Tag';

export type ArticleStatus = 'Draft' | 'Published' | 'Archived' | 'Pending';

// Interface cho Frontend (Dữ liệu hiển thị)
export interface IArticle {
  id: string;
  title: string;
  content: string;
  slug: string;
  summary: string;
  status: ArticleStatus;
  createdAt: Date;
  price: number;       
  area: number;        
  thumbnail: string;   
  // isFeatured: boolean;
  // Các trường quan hệ dạng Object đầy đủ
  category: ICategory | null;
  tags: ITag[];
  author: IUser | null;
}

// Interface Payload gửi lên API (DTO)
export interface CreateArticlePayload {
  title: string;
  slug: string;
  summary: string;
  content: string;
  categoryID: string; // API thường chỉ nhận ID
  tags: string[];     // Array các ID
  status: ArticleStatus;
}

export class Article implements IArticle {
  id: string;
  title: string;
  content: string;
  slug: string;
  summary: string;
  status: ArticleStatus;
  createdAt: Date;
  price: number;       
  area: number;        
  thumbnail: string;  
  category: ICategory | null;
  tags: ITag[];
  author: IUser | null;

  constructor(data: any) {
    // 1. Map ID & Basic Fields
    this.id = data?.id || data?._id || "";
    this.title = data?.title || "";
    this.content = data?.content || "";
    this.slug = data?.slug || "";
    this.summary = data?.summary || "";
    this.status = (data?.status as ArticleStatus) || "Draft";
    this.createdAt = data?.createdAt ? new Date(data.createdAt) : new Date();
    this.price = data?.price || 0
    this.area = data?.area || 0
    this.thumbnail = data?.thumbnail || "fallback-img.png";
    // 2. Map Category (Xử lý linh hoạt cả trường hợp API trả về ID hoặc Object)
    // Ưu tiên check field 'category' hoặc 'categoryID' nếu nó là object
    const rawCat = data?.category || data?.categoryID || data?.categoryId;
    if (typeof rawCat === 'object' && rawCat !== null) {
      this.category = new Category(rawCat);
    } else {
      this.category = null; 
      // Nếu API chỉ trả về chuỗi ID mà không populate, 
      // ta set null hoặc tạo một Category rỗng chỉ có ID tùy logic dự án
    }

    // 3. Map Tags
    const rawTags = data?.tags || data?.tagIds || [];
    if (Array.isArray(rawTags)) {
      this.tags = rawTags.map((t: any) => {
        // Nếu tag là object -> new Tag, nếu là string -> bỏ qua hoặc tạo tag giả
        if (typeof t === 'object' && t !== null) return new Tag(t);
        return new Tag({ _id: t, tagName: 'Unknown' }); // Fallback
      });
    } else {
      this.tags = [];
    }
    
    // 4. Map Author
    const rawAuthor = data?.author || data?.authorID || data?.authorId;
    if (typeof rawAuthor === 'object' && rawAuthor !== null) {
      // Giả sử bạn có class User, nếu chưa có thì dùng object literal
      this.author = new User(rawAuthor); 
    } else {
      this.author = null;
    }
  }

  // Chuyển đổi dữ liệu từ Object -> ID để gửi về Backend
  toApiPayload(): CreateArticlePayload {
    return {
      title: this.title,
      slug: this.slug,
      summary: this.summary,
      content: this.content,
      // Lấy ID từ object category hiện tại
      categoryID: this.category?.id || "",
      // Map mảng object tags ra mảng ID
      tags: this.tags.map(tag => tag.id),
      status: this.status
    };
  }
}