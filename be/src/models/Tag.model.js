import mongoose from 'mongoose';
import slugify from 'slugify';

const TagSchema = new mongoose.Schema(
  {
    tagName: {
      type: String, // Ví dụ: "Chung cư mini", "Điều hòa"
      required: true,
      unique: true,
      trim: true,
    },
    tagSlug: {
      type: String,
      unique: true,
    },
    tagType: {
      type: String,
      enum: ['loai-phong', 'tien-ich', 'noi-that', 'loai-hinh', 'khac'], // Loại phòng, Tiện ích, Nội thất
      default: 'tien-ich',
    },
  },
  { timestamps: true },
);

TagSchema.pre('save', function (next) {
  this.tagSlug = slugify(this.tagName, { lower: true, strict: true });
  next();
});

const Tag = mongoose.model('Tag', TagSchema);
export default Tag;
