import CloudinaryStorage from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import type { Request } from 'express';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request) => ({
    folder: `profiles/${req.user?.id}`, // dynamic folder
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'fill' }],
  }),
});

export const uploadProfile = multer({ storage });
