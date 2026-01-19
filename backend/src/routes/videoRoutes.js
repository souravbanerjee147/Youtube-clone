import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getVideos,
  getVideoById,
  uploadVideo,
  updateVideo,
  deleteVideo,
  searchVideos,
  getChannelVideos,
  likeVideo
} from '../controllers/videoController.js';

const router = express.Router();

// Public routes
router.get('/', getVideos);
router.get('/search', searchVideos);
router.get('/:id', getVideoById);
router.get('/channel/:channelId', getChannelVideos);

// Protected routes
router.post('/', auth, uploadVideo);
router.put('/:id', auth, updateVideo);
router.delete('/:id', auth, deleteVideo);
router.post('/:id/like', auth, likeVideo);

export default router;