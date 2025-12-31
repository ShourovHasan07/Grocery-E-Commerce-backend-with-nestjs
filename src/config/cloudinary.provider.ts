import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    console.log('☁️ Initializing Cloudinary with ENV:', {
      cloud: process.env.CLOUDINARY_CLOUD_NAME,
      key: process.env.CLOUDINARY_API_KEY ? 'FOUND' : 'MISSING',
    });

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return cloudinary;
  },
};
