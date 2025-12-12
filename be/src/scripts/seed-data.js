import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; // Hoặc 'bcrypt' tùy cái bạn cài
import path from 'path';
import { fileURLToPath } from 'url';

// --- Import Models ---
import User from '../models/User.model.js';
import Category from '../models/Category.model.js';
import Tag from '../models/Tag.model.js';
import Article from '../models/Article.model.js';

// --- Config Env ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const seedData = async () => {
  try {
    // 1. Kết nối Database
    console.log('🔌 Connecting to MongoDB...');
    const MONGO_URI = process.env.MONGODB_URI;
    await mongoose.connect(MONGO_URI);

    // 2. Clear Database
    console.log('💥 Dropping existing database...');
    await mongoose.connection.db.dropDatabase();
    console.log('✅ Database dropped. Starting fresh...');
    console.log('🌱 Seeding Users...');

    // Hash password thủ công (Vì đã xóa pre-save hook trong Model)
    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('123456', salt);

    // Admin
    const adminUser = await User.create({
      userName: 'admin',
      fullName: 'Quản Trị Viên',
      email: 'admin@gmail.com',
      hashedPassword: commonPassword, // KEY QUAN TRỌNG
      role: 'Admin', // Enum khớp model
      phoneNumber: '0900000000',
      avatar: 'https://i.pravatar.cc/150?u=admin', // Sửa key avatarUrl -> avatar cho khớp model mới
    });

    // Chủ nhà (Landlord)
    const landlordUser = await User.create({
      userName: 'chunha_uytin',
      fullName: 'Chị Lan (Chủ Nhà)',
      email: 'lanhost@gmail.com',
      hashedPassword: commonPassword,
      role: 'Landlord', // Enum khớp model (Thay vì Editor)
      phoneNumber: '0912345678',
      avatar: 'https://i.pravatar.cc/150?u=host',
    });

    // Người thuê (Tenant)
    const tenantUser = await User.create({
      userName: 'sinhvien_timphong',
      fullName: 'Nguyễn Văn Nam',
      email: 'namstudent@gmail.com',
      hashedPassword: commonPassword,
      role: 'Tenant', // Enum khớp model (Thay vì Subscriber)
      phoneNumber: '0987654321',
      avatar: 'https://i.pravatar.cc/150?u=renter',
    });

    // ---------------------------------------------------------
    // 4. Tạo 10 Categories (Quận/Huyện)
    // ---------------------------------------------------------
    console.log('🌱 Seeding Categories (Districts)...');
    const districtData = [
      { name: 'Quận Cầu Giấy', slug: 'quan-cau-giay' },
      { name: 'Quận Đống Đa', slug: 'quan-dong-da' },
      { name: 'Quận Thanh Xuân', slug: 'quan-thanh-xuan' },
      { name: 'Quận Ba Đình', slug: 'quan-ba-dinh' },
      { name: 'Quận Hoàn Kiếm', slug: 'quan-hoan-kiem' },
      { name: 'Quận Hai Bà Trưng', slug: 'quan-hai-ba-trung' },
      { name: 'Quận Hoàng Mai', slug: 'quan-hoang-mai' },
      { name: 'Quận Tây Hồ', slug: 'quan-tay-ho' },
      { name: 'Quận Nam Từ Liêm', slug: 'quan-nam-tu-liem' },
      { name: 'Quận Bắc Từ Liêm', slug: 'quan-bac-tu-liem' },
    ];
    const categories = await Category.insertMany(
      districtData.map((d) => ({ categoryName: d.name, categorySlug: d.slug })),
    );

    // ---------------------------------------------------------
    // 5. Tạo 10 Tags (Tiện ích)
    // ---------------------------------------------------------
    console.log('🌱 Seeding Tags (Amenities)...');
    const tagData = [
      'Điều hòa',
      'Nóng lạnh',
      'Máy giặt chung',
      'Thang máy',
      'Ban công',
      'Không chung chủ',
      'Chung cư mini',
      'Gác xép',
      'Giường tủ',
      'An ninh tốt',
    ];
    const tags = await Tag.insertMany(
      tagData.map((name) => ({
        tagName: name,
        tagSlug: name
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a'),
      })),
    );

    // ---------------------------------------------------------
    // 6. Tạo Articles (Tin đăng phòng trọ)
    // ---------------------------------------------------------
    console.log('🌱 Seeding Articles...');

    // Tin 1: Phòng Cầu Giấy (Do Landlord đăng)
    const article1 = await Article.create({
      title: 'Phòng trọ khép kín 25m2 đường Cầu Giấy',
      content: '<p>Phòng sạch đẹp, gần ĐH GTVT...</p>',
      summary: 'Ngõ 165 Cầu Giấy, Hà Nội', // Địa chỉ
      price: 3500000,
      area: 25,
      thumbnail: 'https://placehold.co/600x400/png?text=Phong+Tro',
      categoryID: categories[0]._id, // Cầu Giấy
      authorID: landlordUser._id, // Chị Lan
      tags: [tags[0]._id, tags[1]._id], // Điều hòa, Nóng lạnh
      status: 'Published',
    });

    // Tin 2: CCMN Thanh Xuân (Do Landlord đăng)
    const article2 = await Article.create({
      title: 'Chung cư mini full đồ Ngã Tư Sở',
      content: '<p>Tòa nhà 8 tầng thang máy...</p>',
      summary: 'Khương Trung, Thanh Xuân, Hà Nội',
      price: 5200000,
      area: 35,
      thumbnail: 'https://placehold.co/600x400/png?text=CCMN',
      categoryID: categories[2]._id, // Thanh Xuân
      authorID: landlordUser._id,
      tags: [tags[3]._id, tags[6]._id], // Thang máy, CCMN
      status: 'Published',
    });

    // Tin 3: Giá rẻ Bắc Từ Liêm (Đã thuê - Draft)
    await Article.create({
      title: 'Nhượng phòng trọ giá rẻ Kiều Mai',
      content: '<p>Phòng cấp 4 giá rẻ...</p>',
      summary: 'Kiều Mai, Bắc Từ Liêm',
      price: 1500000,
      area: 15,
      thumbnail: 'https://placehold.co/600x400/png?text=Gia+Re',
      categoryID: categories[9]._id, // Bắc Từ Liêm
      authorID: adminUser._id,
      tags: [],
      status: 'Draft',
    });

    console.log('🎉 Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
};

seedData();
