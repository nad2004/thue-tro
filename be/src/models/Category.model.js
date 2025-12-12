import mongoose from 'mongoose';
import slugify from 'slugify';

const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String, // Ví dụ: "Quận Thanh Xuân"
      required: true,
      unique: true,
      trim: true,
    },
    categorySlug: {
      type: String,
      unique: true,
    },
    description: {
      type: String, // Ví dụ: "Khu vực nhiều sinh viên, giá rẻ"
      default: '',
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null, // Phân cấp: Tỉnh/TP -> Quận/Huyện -> Phường/Xã
    },
  },
  { timestamps: true },
);

CategorySchema.pre('save', function (next) {
  this.categorySlug = slugify(this.categoryName, { lower: true, strict: true });
  next();
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
