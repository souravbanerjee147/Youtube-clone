import express from 'express';
import Comment from '../models/Comment.js';
import Video from '../models/Video.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// comments for  video
router.get('/video/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      video: req.params.videoId,
      parentComment: null // Only top-level comments
    })
    .populate('user', 'username avatar')
    .sort('-createdAt')
    .lean();
    
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add comment to video 
router.post('/video/:videoId', auth, async (req, res) => {
  try {
    const { text, parentCommentId } = req.body;
    const videoId = req.params.videoId;
    const userId = req.user._id;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    // Check if video exists
    const video = await Video.findById(videoId);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Create comment
    const comment = new Comment({
      text: text.trim(),
      video: videoId,
      user: userId,
      parentComment: parentCommentId || null
    });
    
    await comment.save();
    
    // Populate user info
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username avatar')
      .lean();
    
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update comment 
router.put('/:id', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const commentId = req.params.id;
    const userId = req.user._id;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    // Find comment
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user owns the comment
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }
    
    // Update comment
    comment.text = text.trim();
    comment.isEdited = true;
    comment.updatedAt = new Date();
    
    await comment.save();
    
    const updatedComment = await Comment.findById(commentId)
      .populate('user', 'username avatar')
      .lean();
    
    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete comment 
router.delete('/:id', auth, async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user._id;
    
    // Find comment
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user owns the comment
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    await Comment.findByIdAndDelete(commentId);
    
    // Also delete any replies to this comment
    await Comment.deleteMany({ parentComment: commentId });
    
    res.json({ 
      message: 'Comment deleted successfully',
      commentId 
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like comment 
router.post('/:id/like', auth, async (req, res) => {
  try {
    const commentId = req.params.id;
    
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json({ 
      message: 'Comment liked successfully',
      likes: comment.likes 
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;