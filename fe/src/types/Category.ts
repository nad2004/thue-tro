export interface ICategory {
  id: string;
  categoryName: string;
  categorySlug: string;
  description: string;
  // parentCategory: string | null;
}
export interface ICategoryBackend {
  _id?: string;
  categoryName: string;
  categorySlug?: string;
  description?: string;
  parentCategory?: ICategoryBackend;
}
export interface CreateCategoryPayload {
  categoryName: string;
  categorySlug: string;
  // parentCategory: string;
}

export class Category implements ICategory {
  id: string;
  categoryName: string;
  categorySlug: string;
  description: string;
  // parentCategory: string;

  constructor(data: ICategoryBackend) {
    this.id = data?._id || '';
    this.categoryName = data?.categoryName || '';
    this.categorySlug = data?.categorySlug || '';
    this.description = data?.description || '';

    const parent = data?.parentCategory;
    // this.parentCategory =
    //   typeof parent === 'object' && parent !== null ? parent._id : parent || null;
  }

  toApiPayload(): CreateCategoryPayload {
    return {
      categoryName: this.categoryName,
      categorySlug: this.categorySlug,
      // parentCategory: this.parentCategory,
    };
  }
}
