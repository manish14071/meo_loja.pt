import multer from "multer";
import fs from 'fs';
import path from 'path';
import { uploadToCloudinary } from "../Config/cloudinaryConfig.js";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads', 'temp');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
      }
      cb(null, true);
  }
});

const cloudinaryUpload = async (req, res, next) => {
  try {
      if (!req.file) {
          return next();
      }
      console.log('Uploading file to Cloudinary:', req.file.path);
      const cloudinaryUrl = await uploadToCloudinary(req.file.path);
      
      if (!cloudinaryUrl || !cloudinaryUrl.startsWith('https://')) {
          throw new Error('Invalid image URL received from Cloudinary');
      }
      console.log('Received Cloudinary URL:', cloudinaryUrl);
      req.cloudinaryUrl = cloudinaryUrl;
      
      fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting temp file:', err);
      });
      
      next();
  } catch (error) {
      if (req.file) {
          fs.unlink(req.file.path, (err) => {
              if (err) console.error('Error deleting temp file:', err);
          });
      }
      
      return res.status(500).json({ 
          success: false,
          message: 'Error uploading to Cloudinary',
          error: error.message 
      });
  }
};


export { cloudinaryUpload };
export default upload;