import Tag from '../models/Tag.model.js';
import slugify from 'slugify';

export class TagService {
  
  // Tạo mới thẻ
  async create(data) {
    if (!data.tagSlug && data.tagName) {
        data.tagSlug = slugify(data.tagName, { lower: true, strict: true });
    }
    const newTag = new Tag(data);
    await newTag.save();
    return newTag;
  }

  // Lấy tất cả thẻ (có thể lọc theo loại)
  async getAll(type = null) {
    const filter = type ? { tagType: type } : {};
    return await Tag.find(filter);
  }

  // Lấy chi tiết thẻ theo ID
  async getById(id) {
    const tag = await Tag.findById(id);
    if (!tag) {
        throw new Error("Không tìm thấy thẻ.");
    }
    return tag;
  }

  /**
   * Cập nhật thẻ
   * - Tự động cập nhật slug nếu đổi tên
   */
  async update(id, data) {
    // Nếu có cập nhật tên, tạo lại slug mới
    if (data.tagName) {
        data.tagSlug = slugify(data.tagName, { lower: true, strict: true });
    }

    const updatedTag = await Tag.findByIdAndUpdate(
        id, 
        data, 
        { new: true, runValidators: true }
    );

    if (!updatedTag) {
      throw new Error("Không tìm thấy thẻ để cập nhật.");
    }
    return updatedTag;
  }
async delete(id) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = await Tag.findByIdAndDelete(id).session(session);

        if (!result) {
            throw new Error("Không tìm thấy thẻ để xóa.");
        }

        await Article.updateMany(
            { tags: id },
            { $pull: { tags: id } }
        ).session(session);

        await session.commitTransaction();
        return { message: "Đã xóa triệt để thành công", id: result._id };

    } catch (error) {
        await session.abortTransaction(); // Hoàn tác nếu có lỗi bất kỳ
        throw error;
    } finally {
        session.endSession();
    }
}
}

export default new TagService();