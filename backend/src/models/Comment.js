import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  video: {
    type: String, // Changed from ObjectId to String
    ref: 'Video',
    required: true
  },
  user: {
    type: String, // Changed from ObjectId to String
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  parentComment: {
    type: String, // Changed from ObjectId to String
    ref: 'Comment',
    default: null
  },
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  _id: false // Disable default _id
});

commentSchema.index({ video: 1, createdAt: -1 });
commentSchema.index({ user: 1 });
commentSchema.index({ parentComment: 1 });

export default mongoose.model('Comment', commentSchema);