import User from '../models/User.model.js';
import bcrypt from 'bcrypt';

export class UserService {
  async register(data) {
    // 1. Kiểm tra trùng lặp email hoặc sđt
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
    });

    if (existingUser) {
      throw new Error('Email hoặc số điện thoại đã tồn tại.');
    }

    // 2. Hash mật khẩu (Giống hệt logic trong seed data)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 3. Tạo user mới với mật khẩu đã mã hóa
    const newUser = new User({
      email: data.email,
      hashedPassword: hashedPassword,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      role: data.role || 'Tenant', // Mặc định người thuê
      avatar: data.avatar || '',
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
      throw new Error('Email hoặc mật khẩu không đúng.');
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không đúng.');
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
    const user = await User.findById(id).select('-hashedPassword').populate('savedArticles');

    if (!user) throw new Error('Không tìm thấy người dùng.');
    return user;
  }

  async update(id, data) {
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select('-hashedPassword');

    if (!updatedUser) throw new Error('Không tìm thấy người dùng.');
    return updatedUser;
  }
  async toggleSaveArticle(userId, articleId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User không tồn tại');

    const isSaved = user.savedArticles.includes(articleId);

    if (isSaved) {
      user.savedArticles.pull(articleId);
    } else {
      user.savedArticles.push(articleId);
    }

    await user.save();
    return {
      saved: !isSaved,
      savedArticles: user.savedArticles,
    };
  }
  async getSavedArticles(userId) {
    const user = await User.findById(userId).populate({
      path: 'savedArticles',
      populate: [
        { path: 'categoryID', select: 'categoryName' },
        { path: 'authorID', select: 'fullName avatar phoneNumber' },
      ],
    });

    if (!user) throw new Error('User không tồn tại');
    return user.savedArticles;
  }
}

export default new UserService();
