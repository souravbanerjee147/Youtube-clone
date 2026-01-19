import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import User from '../models/User.js';

// Get all videos
export const getVideos = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      channel, 
      page = 1, 
      limit = 20,
      sort = '-createdAt'
    } = req.query;
    
    const query = { isPublic: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (channel) {
      query.channel = channel;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const videos = await Video.find(query)
      .populate('channel', 'channelName avatar subscribers')
      .populate('uploadedBy', 'username avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Video.countDocuments(query);
    
    res.json({
      videos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get video by ID
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('channel', 'channelName avatar subscribers')
      .populate('uploadedBy', 'username avatar')
      .lean();
    
    if (!video) {
      return res.status(404).json({ 
        message: 'Video not found',
        requestedId: req.params.id
      });
    }
    
    // Increment view count
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    
    res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Search videos
export const searchVideos = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 20 } = req.query;
    
    const query = { isPublic: true };
    
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const skip = (page - 1) * limit;
    
    const videos = await Video.find(query)
      .populate('channel', 'channelName avatar subscribers')
      .populate('uploadedBy', 'username avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Video.countDocuments(query);
    
    res.json({
      videos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get channel videos
export const getChannelVideos = async (req, res) => {
  try {
    const videos = await Video.find({ 
      channel: req.params.channelId,
      isPublic: true 
    })
      .populate('channel', 'channelName avatar subscribers')
      .populate('uploadedBy', 'username avatar')
      .sort('-createdAt')
      .lean();
    
    res.json(videos);
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload video
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category, tags, duration } = req.body;
    const userId = req.user._id;
    
    if (!title || !description) {
      return res.status(400).json({ 
        message: 'Title and description are required' 
      });
    }
    
    // Find or create channel for user
    let channel = await Channel.findOne({ owner: userId });
    
    if (!channel) {
      const user = await User.findById(userId);
      
      channel = new Channel({
        channelName: `${user.username}'s Channel`,
        description: `Welcome to ${user.username}'s YouTube channel!`,
        owner: userId,
        avatar: user.avatar
      });
      
      await channel.save();
      
      // Update user's channel reference in AuthContext
      // This will be fetched on next /auth/me call
    }
    
    const video = new Video({
      title,
      description,
      videoUrl: videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=320&h=180&fit=crop',
      category: category || 'Entertainment',
      channel: channel._id,
      uploadedBy: userId,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      duration: duration || 1842
    });
    
    await video.save();
    
    const populatedVideo = await Video.findById(video._id)
      .populate('channel', 'channelName avatar subscribers')
      .populate('uploadedBy', 'username avatar')
      .lean();
    
    res.status(201).json({
      message: 'Video uploaded successfully',
      video: populatedVideo
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update video
export const updateVideo = async (req, res) => {
  try {
    const { title, description, category, thumbnailUrl, tags, isPublic } = req.body;
    const userId = req.user._id;
    
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    if (video.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this video' });
    }
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (thumbnailUrl) updateData.thumbnailUrl = thumbnailUrl;
    if (tags) updateData.tags = tags.split(',').map(tag => tag.trim());
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    updateData.updatedAt = new Date();
    
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('channel', 'channelName avatar subscribers')
    .populate('uploadedBy', 'username avatar')
    .lean();
    
    res.json({
      message: 'Video updated successfully',
      video: updatedVideo
    });
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete video
export const deleteVideo = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    if (video.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }
    
    await Video.findByIdAndDelete(req.params.id);
    
    res.json({
      message: 'Video deleted successfully',
      videoId: req.params.id
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Like/Dislike video
export const likeVideo = async (req, res) => {
  try {
    const { action } = req.body;
    const videoId = req.params.id;
    const userId = req.user._id;
    
    const video = await Video.findById(videoId);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    const updateData = {};
    if (action === 'like') {
      updateData.$inc = { likes: 1 };
    } else if (action === 'dislike') {
      updateData.$inc = { dislikes: 1 };
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
    
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      updateData,
      { new: true }
    );
    
    res.json({
      message: 'Video reaction updated',
      likes: updatedVideo.likes,
      dislikes: updatedVideo.dislikes
    });
  } catch (error) {
    console.error('Error liking video:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};