import User from '../models/User.model.js';
import bcrypt from 'bcrypt';

export class UserService {
  
 async register(data) {
    // 1. Kiểm tra trùng lặp email hoặc sđt
    const existingUser = await User.findOne({ 
        $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }] 
    });
    
    if (existingUser) {
        throw new Error("Email hoặc số điện thoại đã tồn tại.");
    }

    // 2. Hash mật khẩu (Giống hệt logic trong seed data)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 3. Tạo user mới với mật khẩu đã mã hóa
    const newUser = new User({
        userName: data.userName,
        email: data.email,
        hashedPassword: hashedPassword, // <-- Đã sửa: Gán chuỗi mã hóa, không gán raw password
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        role: data.role || 'Tenant', // Mặc định người thuê
        avatar: data.avatar || ''
    });

    await newUser.save();
    
    // Xóa field mật khẩu trước khi trả về để bảo mật
    const userResponse = newUser.toObject();
    delete userResponse.hashedPassword;
    
    return userResponse;
  }

  async login(email, password) {
    // Tìm user theo email
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng.");
    }
    
    // So sánh mật khẩu nhập vào với mật khẩu đã hash trong DB
    // Lưu ý: Hàm comparePassword phải được định nghĩa trong User Model (methods)
    // Hoặc bạn có thể dùng trực tiếp: const isMatch = await bcrypt.compare(password, user.hashedPassword);
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    
    if (!isMatch) {
      throw new Error("Email hoặc mật khẩu không đúng.");
    }

    // Xóa field mật khẩu trước khi trả về
    const userResponse = user.toObject();
    delete userResponse.hashedPassword;

    return userResponse;
  }

  async getAll() {
    return await User.find({}).select('-hashedPassword');
  }

  async getById(id) {
    const user = await User.findById(id).select('-hashedPassword');
    if (!user) throw new Error("Không tìm thấy người dùng.");
    return user;
  }
  
  async update(id, data) {
    // Không cho phép update role tùy tiện nếu không phải Admin (cần xử lý ở Controller/Middleware)
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      data, 
      { new: true, runValidators: true }
    ).select('-hashedPassword');

    if (!updatedUser) throw new Error("Không tìm thấy người dùng.");
    return updatedUser;
  }
}

export default new UserService();