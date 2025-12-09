const fs = require('fs');
const path = require('path');

const rootDir = 'be'; // Giữ nguyên tên thư mục gốc

// 1. Hàm tiện ích để tạo file và thư mục
function createFile(filePath, content) {
    const absolutePath = path.join(rootDir, filePath);
    const dir = path.dirname(absolutePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(absolutePath, content.trim() + '\n');
    console.log(`Created: ${filePath}`);
}

// 2. Tạo thư mục gốc
if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir);
}

console.log("Đang khởi tạo cấu trúc dự án Blog/News (Controller-Service-Route) với Mongoose...");

// 3. Nội dung các file
const files = {
    // ----------------------------------------------------
    // Root Files
    // ----------------------------------------------------
    'package.json': `
{
  "name": "be",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "seed": "node src/scripts/seed-data.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "Backend for a Blog/News application using Controller-Service-Mongoose structure.",
  "dependencies": {
    "@sendgrid/mail": "^8.1.6",
    "axios": "^1.13.1",
    "bcryptjs": "^3.0.2",
    "cloudinary": "^2.8.0",
    "compression": "^1.8.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "exceljs": "^4.4.0",
    "express": "^5.1.0",
    "express-rate-limit": "^8.2.1",
    "google-auth-library": "^10.5.0",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.2",
    "module-alias": "^2.2.3",
    "moment": "^2.30.1",
    "moment-timezone": "^0.6.0",
    "mongoose": "^8.19.2",
    "morgan": "^1.10.1",
    "multer": "^2.0.2",
    "node-cron": "^4.2.1",
    "nodemailer": "^7.0.10",
    "otp-generator": "^4.0.1",
    "pdfkit": "^0.17.2",
    "qrcode": "^1.5.4",
    "qs": "^6.14.0",
    "redis": "^5.9.0",
    "slugify": "^1.6.6",
    "socket.io": "^4.8.1",
    "streamifier": "^0.1.1",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1",
    "twilio": "^5.10.4",
    "validator": "^13.15.20"
  },
  "devDependencies": {
    "@types/jest": "^30.0.0",
    "eslint": "^9.39.1",
    "eslint-config-prettier": "^10.1.8",
    "jest": "^29.7.0",
    "nodemon": "^3.1.10",
    "prettier": "^3.6.2",
    "supertest": "^7.1.4"
  }
}
`,
    '.env': `
# File cấu hình biến môi trường
# Vui lòng điền thông tin kết nối MongoDB Atlas/Local
# ----------------------------------------------------
MONGODB_URI=
PORT=3000
JWT_SECRET=your_long_random_secret_key
`,
    '.gitignore': `
/node_modules
.env
*.log
`,

    // ----------------------------------------------------
    // src/config
    // ----------------------------------------------------
    'src/config/db.config.js': `
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ Lỗi: MONGODB_URI không được định nghĩa trong .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối tới MongoDB thành công!');
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  }
};

export default connectDB;
`,

    // ----------------------------------------------------
    // src/models (5 Entities + 1 Transaction Table)
    // ----------------------------------------------------
    // 1. Người dùng / Biên tập viên (Users / Editors)
    'src/models/User.model.js': `
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
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Editor', 'Writer', 'Reader'],
    default: 'Reader',
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Middleware để hash password trước khi lưu
UserSchema.pre('save', async function (next) {
  if (!this.isModified('hashedPassword')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.hashedPassword = await bcrypt.hash(this.hashedPassword, salt);
  next();
});

// Method so sánh password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.hashedPassword);
};

const User = mongoose.model('User', UserSchema);
export default User;
`,
    // 2. Chuyên mục / Danh mục (Categories)
    'src/models/Category.model.js': `
import mongoose from 'mongoose';
import slugify from 'slugify';

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  categorySlug: {
    type: String,
    unique: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null, // Cho phép phân cấp
  }
}, { timestamps: true });

CategorySchema.pre('save', function(next) {
    this.categorySlug = slugify(this.categoryName, { lower: true, strict: true });
    next();
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
`,
    // 3. Bài viết / Tin tức (Articles / Posts)
    'src/models/Article.model.js': `
import mongoose from 'mongoose';
import slugify from 'slugify';

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  publishedDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Published', 'Archived'],
    default: 'Draft',
  }
}, { timestamps: true });

ArticleSchema.pre('save', function(next) {
    this.slug = slugify(this.title, { lower: true, strict: true });
    next();
});

const Article = mongoose.model('Article', ArticleSchema);
export default Article;
`,
    // 4. Bình luận (Comments)
    'src/models/Comment.model.js': `
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  articleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Cho phép bình luận ẩn danh
  },
  guestName: {
    type: String,
    required: function() { return !this.userID; } // Bắt buộc nếu không có UserID
  },
  commentText: {
    type: String,
    required: true,
  },
  parentCommentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null, // Trả lời bình luận khác
  }
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
`,
    // 5. Thẻ / Nhãn (Tags)
    'src/models/Tag.model.js': `
import mongoose from 'mongoose';
import slugify from 'slugify';

const TagSchema = new mongoose.Schema({
  tagName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  tagSlug: {
    type: String,
    unique: true,
  }
}, { timestamps: true });

TagSchema.pre('save', function(next) {
    this.tagSlug = slugify(this.tagName, { lower: true, strict: true });
    next();
});

const Tag = mongoose.model('Tag', TagSchema);
export default Tag;
`,
    // 6. Bảng Giao Dịch: Liên kết Bài viết và Thẻ (Article_Tags)
    'src/models/ArticleTag.model.js': `
import mongoose from 'mongoose';

const ArticleTagSchema = new mongoose.Schema({
  articleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  tagID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true,
  }
  // AssociationDate được bao gồm trong timestamps: true (createdAt)
}, { timestamps: true });

// Đảm bảo cặp (articleID, tagID) là duy nhất
ArticleTagSchema.index({ articleID: 1, tagID: 1 }, { unique: true });

const ArticleTag = mongoose.model('ArticleTag', ArticleTagSchema);
export default ArticleTag;
`,
    
    // ----------------------------------------------------
    // src/services (Ví dụ cho User)
    // ----------------------------------------------------
    'src/services/User.service.js': `
import User from '../models/User.model.js';

export class UserService {
  
  async register(data) {
    // data: { userName, email, password, fullName, role }
    const newUser = new User({
        userName: data.userName,
        email: data.email,
        hashedPassword: data.password, // Schema pre-save sẽ hash nó
        fullName: data.fullName,
        role: data.role || 'Reader'
    });
    await newUser.save();
    // Loại bỏ password trước khi trả về
    newUser.hashedPassword = undefined; 
    return newUser;
  }

  async getAll() {
    return await User.find({}).select('-hashedPassword');
  }

  async getById(id) {
    const user = await User.findById(id).select('-hashedPassword');
    if (!user) {
        throw new Error("Không tìm thấy người dùng.");
    }
    return user;
  }
}

export default new UserService();
`,

    // ----------------------------------------------------
    // src/controllers (Ví dụ cho User)
    // ----------------------------------------------------
    'src/controllers/User.controller.js': `
import UserService from '../services/User.service.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class UserController {
  
  // POST /api/v1/users/register
  async register(req, res) {
    try {
      const { password, ...userData } = req.body;
      if (!password) {
        return res.status(400).json({ success: false, error: 'Mật khẩu là bắt buộc.' });
      }

      const result = await UserService.register({ ...userData, password });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      // Xử lý lỗi trùng lặp (11000) hoặc validation
      const statusCode = (error.code === 11000 || error.name === 'ValidationError') ? 400 : 500;
      res.status(statusCode).json({ success: false, error: error.message });
    }
  }

  // GET /api/v1/users
  async getAll(req, res) {
    try {
      const result = await UserService.getAll();
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: "Lỗi Server: " + error.message });
    }
  }
}

export default new UserController();
`,

    // ----------------------------------------------------
    // src/routes (Ví dụ cho User)
    // ----------------------------------------------------
    'src/routes/user.route.js': `
import express from 'express';
import UserController from '../controllers/User.controller.js';

const router = express.Router();

// Định tuyến
router.post('/register', UserController.register);
router.get('/', UserController.getAll);
// Thêm các route khác: login, getById, update, delete

export default router;
`,
    
    // ----------------------------------------------------
    // src/server.js (Main App file)
    // ----------------------------------------------------
    'src/server.js': `
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
import userRoutes from './routes/user.route.js';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();

// Kết nối Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware bảo mật và logging
app.use(helmet());
app.use(cors());
app.use(morgan('tiny')); // Logging HTTP requests
app.use(express.json()); // Cho phép đọc body JSON

// Route chính
app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/articles', articleRoutes);
// app.use('/api/v1/categories', categoryRoutes);


app.get('/', (req, res) => {
  res.send('API Blog/News - Controller-Service-Mongoose');
});

// Xử lý lỗi 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint không tìm thấy'
    });
});


app.listen(PORT, () => {
  console.log(\`Server đang chạy tại http://localhost:\${PORT}\`);
});
`
};

// 4. Thực thi tạo file
Object.entries(files).forEach(([filePath, content]) => {
    createFile(filePath, content);
});

console.log("---------------------------------------------------");
console.log("✅ Đã tạo xong dự án 'be' cho ứng dụng Blog/News!");
console.log("Cấu trúc Models đã hoàn thành cho 6 thực thể/bảng.");
console.log("Các bước tiếp theo:");
console.log("1. cd be");
console.log("2. Cập nhật file .env với khóa MONGODB_URI và JWT_SECRET.");
console.log("3. npm install");
console.log("4. npm run dev");
console.log("---------------------------------------------------");