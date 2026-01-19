
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Channel from '../models/Channel.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }
    
    // Create user
    const user = new User({
      username,
      email,
      password
    });
    
    await user.save();
    
    // Create default channel for user
    const channel = new Channel({
      channelName: `${username}'s Channel`,
      description: `Welcome to ${username}'s YouTube channel!`,
      owner: user._id,
      avatar: user.avatar
    });
    
    await channel.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Get current user (Protected)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -__v')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's channel
    let channel = await Channel.findOne({ owner: user._id })
      .select('_id channelName description subscribers avatar channelBanner')
      .lean();
    
    // If user doesn't have a channel, create one
    if (!channel) {
      const newChannel = new Channel({
        channelName: `${user.username}'s Channel`,
        description: `Welcome to ${user.username}'s YouTube channel!`,
        owner: user._id,
        avatar: user.avatar
      });
      
      await newChannel.save();
      
      channel = await Channel.findById(newChannel._id)
        .select('_id channelName description subscribers avatar channelBanner')
        .lean();
    }
    
    res.json({
      user: {
        ...user,
        channel: channel || null
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Update user profile (Protected)
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const userId = req.user._id;
    
    const updateData = {};
    if (username) updateData.username = username;
    if (avatar) updateData.avatar = avatar;
    updateData.updatedAt = new Date();
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -__v');
    
    // Update channel name if username changed
    if (username) {
      await Channel.findOneAndUpdate(
        { owner: userId },
        { channelName: `${username}'s Channel` }
      );
    }
    
    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;