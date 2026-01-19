import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './src/models/Video.js';

dotenv.config();

async function checkVideos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const videos = await Video.find({}, '_id title').lean();
    
    console.log(`Found ${videos.length} videos in database:`);
    
    videos.forEach((video, index) => {
      console.log(`${index + 1}. ID: ${video._id}`);
      console.log(`   Title: ${video.title}`);
    });
    
    await mongoose.disconnect();
    console.log('Disconnected');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkVideos();