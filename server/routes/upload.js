import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = Router();

/**
 * POST /api/upload
 * Upload images to Cloudinary via Multer
 * Returns array of { url, public_id, thumbnail }
 */
router.post('/', requireAuth, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      thumbnail: cloudinary.url(file.filename, {
        width: 400,
        height: 300,
        crop: 'fill',
        quality: 'auto:low',
        fetch_format: 'auto',
      }),
    }));

    res.status(201).json({ images });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

/**
 * DELETE /api/upload/:publicId
 * Delete an image from Cloudinary
 */
router.delete('/:publicId', requireAuth, async (req, res) => {
  try {
    const { publicId } = req.params;
    const fullPublicId = `delhibikeshub/${publicId}`;

    const result = await cloudinary.uploader.destroy(fullPublicId);

    if (result.result !== 'ok') {
      return res.status(400).json({ error: 'Failed to delete image' });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Image delete error:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
