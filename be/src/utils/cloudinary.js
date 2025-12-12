// src/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload buffer file lên Cloudinary
 * @param {Buffer} fileBuffer - Buffer của file ảnh
 * @param {string} folder - Tên folder trên Cloudinary
 * @returns {Promise<object>} Kết quả upload
 */
export function uploadToCloudinary(fileBuffer, folder = 'nhatro_articles') {
  return new Promise((resolve, reject) => {
    // Tạo writable stream cho Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto', // Tự động nhận diện (image/video)
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );
    // Ghi buffer vào stream
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}
