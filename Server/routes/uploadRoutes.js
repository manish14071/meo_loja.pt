import express from 'express';
import upload, {  cloudinaryUpload } from '../middleware/uploadMiddleware.js';


const router = express.Router();

router.post('/', upload.single('image'), cloudinaryUpload, (req, res) => {
    try {
        // Debug log to see what's available
        console.log('Request cloudinaryUrl:', req.cloudinaryUrl);
        
        if (!req.cloudinaryUrl) {
            throw new Error('Cloudinary URL not set in middleware');
        }

        // Make sure to send the cloudinaryUrl as the image property
        res.json({ 
            success: true,
            message: 'Image uploaded successfully',
            image: req.cloudinaryUrl  // This was missing or incorrect
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Error processing upload'
        });
    }
});



router.get('/test-config', async (req, res) => {
  try {
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: '***' // Hide secret in response
    };
    
    // Test if values are present
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Missing Cloudinary credentials');
    }
    
    res.json({ 
      status: 'Configuration loaded',
      config 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Configuration error',
      message: error.message 
    });
  }
});

export default router;