import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['Admin', 'Landlord', 'Tenant'],
      default: 'Tenant',
    },
    savedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article', // Tham chiếu đến bảng Article
      },
    ],
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  },
);
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.hashedPassword);
};

const User = mongoose.model('User', UserSchema);
export default User;
