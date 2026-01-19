import express from 'express';
import mongoose from 'mongoose';
import Channel from '../models/Channel.js';
import Video from '../models/Video.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get channel by ID or name
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let channel;
    
    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      channel = await Channel.findById(id)
        .populate('owner', 'username avatar')
        .lean();
    } else {
      // If not a valid ObjectId, try to find by channelName or other field
      channel = await Channel.findOne({ 
        $or: [
          { channelName: new RegExp(id, 'i') },
          { _id: id }
        ]
      })
      .populate('owner', 'username avatar')
      .lean();
    }
    
    if (!channel) {
      return res.status(404).json({ 
        message: 'Channel not found',
        id: id 
      });
    }
    
    // Get channel statistics
    const videoCount = await Video.countDocuments({ 
      channel: channel._id,
      isPublic: true 
    });
    
    const totalViews = await Video.aggregate([
      { $match: { channel: channel._id, isPublic: true } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    res.json({
      ...channel,
      videoCount,
      totalViews: totalViews[0]?.total || 0
    });
  } catch (error) {
    console.error('Error fetching channel:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid channel ID' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user's channel
router.get('/user/current', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    let channel = await Channel.findOne({ owner: userId })
      .populate('owner', 'username avatar')
      .lean();
    
    if (!channel) {
      // Create default channel if doesn't exist
      const user = await User.findById(userId);
      
      channel = new Channel({
        channelName: `${user.username}'s Channel`,
        description: `Welcome to ${user.username}'s YouTube channel!`,
        owner: userId,
        avatar: user.avatar
      });
      
      await channel.save();
      
      // Populate after save
      channel = await Channel.findById(channel._id)
        .populate('owner', 'username avatar')
        .lean();
    }
    
    // Get channel statistics
    const videoCount = await Video.countDocuments({ 
      channel: channel._id,
      isPublic: true 
    });
    
    const totalViews = await Video.aggregate([
      { $match: { channel: channel._id, isPublic: true } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    res.json({
      ...channel,
      videoCount,
      totalViews: totalViews[0]?.total || 0
    });
  } catch (error) {
    console.error('Error fetching user channel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user's channel ID for frontend
router.get('/user/id', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    let channel = await Channel.findOne({ owner: userId }).select('_id channelName');
    
    if (!channel) {
      // Create default channel
      const user = await User.findById(userId);
      
      channel = new Channel({
        channelName: `${user.username}'s Channel`,
        owner: userId,
        avatar: user.avatar
      });
      
      await channel.save();
    }
    
    res.json({
      channelId: channel._id,
      channelName: channel.channelName
    });
  } catch (error) {
    console.error('Error fetching user channel ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update channel
router.put('/:id', auth, async (req, res) => {
  try {
    const { channelName, description, channelBanner, avatar, socialLinks } = req.body;
    const userId = req.user._id;
    
    // Find channel
    const channel = await Channel.findById(req.params.id);
    
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    
    // Check if user owns the channel
    if (channel.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this channel' });
    }
    
    // Update fields
    const updateData = {};
    if (channelName) updateData.channelName = channelName;
    if (description) updateData.description = description;
    if (channelBanner) updateData.channelBanner = channelBanner;
    if (avatar) updateData.avatar = avatar;
    if (socialLinks) updateData.socialLinks = socialLinks;
    updateData.updatedAt = new Date();
    
    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'username avatar');
    
    res.json({
      message: 'Channel updated successfully',
      channel: updatedChannel
    });
  } catch (error) {
    console.error('Error updating channel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Subscribe to channel 
router.post('/:id/subscribe', auth, async (req, res) => {
  try {
    const channelId = req.params.id;
    const userId = req.user._id;
    
    const channel = await Channel.findById(channelId);
    
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    
    // Don't subscribe to own channel
    if (channel.owner.toString() === userId.toString()) {
      return res.status(400).json({ message: 'Cannot subscribe to your own channel' });
    }
    
    // Check if already subscribed
    if (channel.subscribers.includes(userId)) {
      // Unsubscribe
      const updatedChannel = await Channel.findByIdAndUpdate(
        channelId,
        { $pull: { subscribers: userId } },
        { new: true }
      );
      
      res.json({
        message: 'Unsubscribed successfully',
        subscribers: updatedChannel.subscribers.length,
        subscribed: false
      });
    } else {
      // Subscribe
      const updatedChannel = await Channel.findByIdAndUpdate(
        channelId,
        { $addToSet: { subscribers: userId } },
        { new: true }
      );
      
      res.json({
        message: 'Subscribed successfully',
        subscribers: updatedChannel.subscribers.length,
        subscribed: true
      });
    }
  } catch (error) {
    console.error('Error subscribing to channel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;