import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  // MongoDB handle _id automatically
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  videoUrl: {
    type: String,
    required: true,
    default: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  thumbnailUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=320&h=180&fit=crop'
  },
  category: {
    type: String,
    enum: ['All', 'Entertainment', 'Music', 'Gaming', 'Education', 'Technology', 'Sports', 'News', 'Other'],
    default: 'Entertainment'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });
videoSchema.index({ category: 1 });
videoSchema.index({ channel: 1 });
videoSchema.index({ uploadedBy: 1 });
videoSchema.index({ createdAt: -1 });

const Video = mongoose.model('Video', videoSchema);
export default Video;