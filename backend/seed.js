import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Channel from './src/models/Channel.js';
import Video from './src/models/Video.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        username: 'alex_wong',
        email: 'alex@example.com',
        password: 'password123',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.username}`);
    }

    // Create channels
    const channels = [
      {
        channelName: 'Code with John',
        description: 'Learn programming and web development with John Doe',
        owner: createdUsers[0]._id,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        subscribers: [createdUsers[1]._id, createdUsers[2]._id]
      },
      {
        channelName: 'JavaScript Mastery',
        description: 'Master JavaScript and modern web technologies',
        owner: createdUsers[1]._id,
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        subscribers: [createdUsers[0]._id]
      },
      {
        channelName: 'Tech Tutorials',
        description: 'Technology tutorials and reviews',
        owner: createdUsers[2]._id,
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        subscribers: [createdUsers[0]._id, createdUsers[1]._id]
      }
    ];

    const createdChannels = [];
    for (const channelData of channels) {
      const channel = new Channel(channelData);
      await channel.save();
      createdChannels.push(channel);
      console.log(`📺 Created channel: ${channel.channelName}`);
    }

    // Create videos
    const videos = [
      {
        title: 'Learn React in 30 Minutes',
        description: 'A quick tutorial to get started with React. Learn the basics of components, state, and props.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=320&h=180&fit=crop',
        category: 'Education',
        views: 15200,
        likes: 1023,
        dislikes: 45,
        duration: 1842,
        channel: createdChannels[0]._id,
        uploadedBy: createdUsers[0]._id,
        tags: ['react', 'javascript', 'web development']
      },
      {
        title: 'JavaScript Fundamentals for Beginners',
        description: 'Learn JavaScript basics from scratch. Perfect for absolute beginners.',
        videoUrl: 'https://www.youtube.com/embed/hdI2bqOjy3c',
        thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=320&h=180&fit=crop',
        category: 'Education',
        views: 25400,
        likes: 1500,
        dislikes: 25,
        duration: 2567,
        channel: createdChannels[1]._id,
        uploadedBy: createdUsers[1]._id,
        tags: ['javascript', 'programming', 'beginner']
      },
      {
        title: 'Building a Full Stack MERN Application',
        description: 'Complete tutorial on building a web app with MERN stack (MongoDB, Express, React, Node.js).',
        videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=320&h=180&fit=crop',
        category: 'Technology',
        views: 18500,
        likes: 890,
        dislikes: 12,
        duration: 3245,
        channel: createdChannels[2]._id,
        uploadedBy: createdUsers[2]._id,
        tags: ['mern', 'fullstack', 'nodejs', 'react']
      },
      {
        title: 'CSS Grid Tutorial for Beginners',
        description: 'Learn how to create modern layouts with CSS Grid.',
        videoUrl: 'https://www.youtube.com/embed/9zBsdzdE4sM',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=180&fit=crop',
        category: 'Education',
        views: 9800,
        likes: 450,
        dislikes: 8,
        duration: 2150,
        channel: createdChannels[0]._id,
        uploadedBy: createdUsers[0]._id,
        tags: ['css', 'web design', 'frontend']
      },
      {
        title: 'Node.js REST API Tutorial',
        description: 'Build a complete REST API with Node.js, Express, and MongoDB.',
        videoUrl: 'https://www.youtube.com/embed/-MTSQjw5DrM',
        thumbnailUrl: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=320&h=180&fit=crop',
        category: 'Technology',
        views: 12400,
        likes: 720,
        dislikes: 15,
        duration: 2850,
        channel: createdChannels[1]._id,
        uploadedBy: createdUsers[1]._id,
        tags: ['nodejs', 'api', 'backend']
      }
    ];

    for (const videoData of videos) {
      const video = new Video(videoData);
      await video.save();
      console.log(`🎬 Created video: ${video.title}`);
    }

    console.log('Seed data created successfully!');
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Channels: ${createdChannels.length}`);
    console.log(`Videos: ${videos.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();