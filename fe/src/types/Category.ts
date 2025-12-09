// src/models/Category.ts

export interface ICategory {
  id: string;
  categoryName: string;
  categorySlug: string;
  description: string;
  parentCategoryId: string | null;
}

export interface CreateCategoryPayload {
  categoryName: string;
  categorySlug: string;
  parentCategory: string | null;
}

export class Category implements ICategory {
  id: string;
  categoryName: string;
  categorySlug: string;
  description: string;
  parentCategoryId: string | null;

  constructor(data: any) {
    this.id = data?.id || data?._id || "";
    
    // Mapping linh hoạt
    this.categoryName = data?.categoryName || data?.name || "";
    this.categorySlug = data?.categorySlug || data?.slug || "";
    this.description = data?.description || "";
    
    // Xử lý logic parentCategory (Object hoặc ID string)
    const parent = data?.parentCategory;
    this.parentCategoryId = (typeof parent === 'object' && parent !== null) 
      ? parent._id 
      : (parent || null);
  }

  toApiPayload(): CreateCategoryPayload {
    return {
      categoryName: this.categoryName,
      categorySlug: this.categorySlug,
      parentCategory: this.parentCategoryId
    };
  }
}