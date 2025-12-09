import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
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
    // Lưu ý: Đảm bảo Enum này khớp với logic frontend/backend của bạn
    // (Trong seed cũ là Editor/Subscriber, ở đây là Landlord/Tenant)
    enum: ['Admin', 'Landlord', 'Tenant'], 
    default: 'Tenant',
  },
  // Không cần registrationDate vì timestamps: true đã tự tạo createdAt
}, { 
  timestamps: true // Tự động tạo createdAt và updatedAt
});

// --- QUAN TRỌNG: ĐÃ XÓA HOÀN TOÀN ĐOẠN pre('save') ---

// Vẫn giữ method này nếu bạn muốn dùng (Service có thể gọi user.comparePassword(pass))
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.hashedPassword);
};

const User = mongoose.model('User', UserSchema);
export default User;