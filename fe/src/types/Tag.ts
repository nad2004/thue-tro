// src/models/Tag.ts

export interface ITag {
  id: string;
  tagName: string;
  tagSlug: string;
}

// Payload gửi lên API (DTO)
export interface CreateTagPayload {
  tagName: string;
  tagSlug: string;
}

export class Tag implements ITag {
  id: string;
  tagName: string;
  tagSlug: string;

  // Dùng 'any' cho input constructor để linh hoạt xử lý dữ liệu hỗn tạp từ API cũ,
  // hoặc định nghĩa interface backend cụ thể nếu muốn chặt chẽ hơn.
  constructor(data: any) {
    this.id = data?.id || data?._id || "";
    // Backend trả về tagName hoặc name
    this.tagName = data?.tagName || data?.name || "";
    // Backend trả về tagSlug hoặc slug
    this.tagSlug = data?.tagSlug || data?.slug || "";
  }

  toApiPayload(): CreateTagPayload {
    return { 
      tagName: this.tagName, 
      tagSlug: this.tagSlug 
    };
  }
}