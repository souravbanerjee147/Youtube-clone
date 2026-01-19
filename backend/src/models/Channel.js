import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: 'No description provided.'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  avatar: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  },
  channelBanner: {
    type: String,
    default: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1920&h=250&fit=crop'
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  socialLinks: {
    website: String,
    twitter: String,
    instagram: String
  }
}, {
  timestamps: true
});

// Indexes
channelSchema.index({ channelName: 'text', description: 'text' });
channelSchema.index({ owner: 1 });

// Export the model
const Channel = mongoose.model('Channel', channelSchema);
export default Channel;