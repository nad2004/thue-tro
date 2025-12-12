import Category from '../models/Category.model.js';
import slugify from 'slugify';

export class CategoryService {
  async create(data) {
    if (!data.categorySlug && data.categoryName) {
      data.categorySlug = slugify(data.categoryName, { lower: true, strict: true });
    }
    return await Category.create(data);
  }

  async getAll() {
    // Lấy danh sách quận huyện
    return await Category.find({}).populate('parentCategory');
  }

  async getById(id) {
    const category = await Category.findById(id).populate('parentCategory');
    if (!category) throw new Error('Không tìm thấy khu vực.');
    return category;
  }

  async update(id, data) {
    if (data.categoryName) {
      data.categorySlug = slugify(data.categoryName, { lower: true, strict: true });
    }

    const updated = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('parentCategory');

    if (!updated) {
      throw new Error('Không tìm thấy chuyên mục để cập nhật.');
    }
    return updated;
  }

  async delete(id) {
    const result = await Category.findByIdAndDelete(id);

    if (!result) {
      throw new Error('Không tìm thấy chuyên mục để xóa.');
    }
    // TODO: Cần xử lý các Article thuộc chuyên mục này (gán về category mặc định hoặc xóa)
    return { message: 'Đã xóa chuyên mục thành công', id: result._id };
  }
}

export default new CategoryService();
