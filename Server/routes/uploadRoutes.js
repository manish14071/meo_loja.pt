// Server/routes/uploadRoutes.js
import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  if (req.file) {
    res.status(200).send({
      message: 'Image uploaded successfully',
      image: req.file.path,
    });
  } else {
    res.status(400).send({ message: 'No image file provided' });
  }
});

export default router;