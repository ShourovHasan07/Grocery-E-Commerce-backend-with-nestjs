// src/config/multer-cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import * as dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// নতুন সঠিক CloudinaryStorage syntax
export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'products',        // এই folder-এ আপলোড হবে
      format: 'png',             // default format
      allowed_formats: ['jpg', 'jpeg', 'png'],
      public_id: `${Date.now()}-${file.originalname}`, // unique নাম
    };
  },
});

export const upload = multer({ storage: cloudinaryStorage });
