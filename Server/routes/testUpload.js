import express from 'express';
import { uploadToCloudinary } from '../Config/cloudinaryConfig.js';

const router = express.Router();

router.post('/test-upload', async (req, res) => {
  const filePath = 'path/to/your/test/image.jpg'; // Replace with a valid file path
  try {
    const url = await uploadToCloudinary(filePath);
    res.json({ success: true, url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router; 