# YouTube Clone - MERN Stack Project

## 📋 Project Overview

A full-featured YouTube clone built with the MERN stack (MongoDB, Express, React, Node.js). This application replicates core YouTube functionalities including video uploading, user authentication, channel management, and video interaction features.

## ✨ Features

### 🎥 Video Features
- **Video Upload & Management**: Upload, edit, and delete videos
- **Video Player**: Watch videos with responsive player
- **Categories**: Filter videos by categories (Music, Gaming, Education, etc.)
- **Search Functionality**: Search videos by title or description
- **Like/Dislike System**: Interactive video rating system
- **Comments**: Add, edit, and delete comments on videos
- **Views Tracking**: Automatic view count incrementing

### 👤 User Features
- **User Authentication**: JWT-based registration and login
- **User Profiles**: Customizable user profiles with avatars
- **Channel Creation**: Automatic channel creation for registered users
- **Channel Management**: Edit channel details, view subscriber counts

### 🎨 UI/UX Features
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark/Light Theme**: Toggle between dark and light modes
- **YouTube-like Interface**: Familiar YouTube UI layout
- **Sidebar Navigation**: Collapsible sidebar with categories
- **Video Grid Layout**: Responsive video thumbnail grid

### 🔧 Technical Features
- **RESTful API**: Well-structured backend API
- **MongoDB Database**: NoSQL database with proper schemas
- **JWT Authentication**: Secure token-based authentication
- **File Upload**: Video and thumbnail upload handling
- **Error Handling**: Comprehensive error handling throughout

## 🏗️ Technology Stack

### Frontend
- **React 18+** - UI library
- **React Router DOM** - Navigation
- **React Context API** - State management
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client
- **Vite** - Build tool (alternative to deprecated Create React App)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **CORS** - Cross-origin resource sharing



## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/youtube-clone
   JWT_SECRET=your_super_secret_jwt_key_here
   FRONTEND_URL=http://localhost:5173
   ```

4. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API base URL**
   Update `frontend/src/services/api.js` if needed:
   ```javascript
   const api = axios.create({
     baseURL: 'http://localhost:5001/api',
     // ... rest of config
   });
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Videos
- `GET /api/videos` - Get all videos (with pagination, search, filter)
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos` - Upload new video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video
- `GET /api/videos/channel/:channelId` - Get videos by channel
- `POST /api/videos/:id/like` - Like/dislike video

### Channels
- `GET /api/channels/:id` - Get channel by ID
- `GET /api/channels/user/current` - Get current user's channel
- `PUT /api/channels/:id` - Update channel
- `POST /api/channels/:id/subscribe` - Subscribe to channel

### Comments
- `GET /api/comments/video/:videoId` - Get comments for video
- `POST /api/comments/video/:videoId` - Add comment to video
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like comment

## 📊 Database Schema

### User Model
```javascript
{
  username: String,      // Required, unique
  email: String,         // Required, unique
  password: String,      // Required, hashed
  avatar: String,        // Default avatar URL
  role: String,          // 'user' or 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### Channel Model
```javascript
{
  channelName: String,   // Required
  description: String,
  owner: ObjectId,       // References User
  avatar: String,        // Channel avatar
  channelBanner: String, // Channel banner image
  subscribers: [ObjectId], // Array of User IDs
  socialLinks: Object,   // Website, Twitter, Instagram
  createdAt: Date,
  updatedAt: Date
}
```

### Video Model
```javascript
{
  title: String,         // Required
  description: String,
  videoUrl: String,      // Required
  thumbnailUrl: String,  // Default thumbnail
  category: String,      // Enum: Entertainment, Music, etc.
  views: Number,         // Default: 0
  likes: Number,         // Default: 0
  dislikes: Number,      // Default: 0
  duration: Number,      // In seconds
  channel: ObjectId,     // References Channel
  uploadedBy: ObjectId,  // References User
  isPublic: Boolean,     // Default: true
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  text: String,          // Required
  video: String,         // References Video
  user: String,          // References User
  likes: Number,         // Default: 0
  parentComment: String, // For nested comments (optional)
  isEdited: Boolean,     // Default: false
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Key Features Implementation

### 1. Authentication Flow
- JWT tokens stored in localStorage
- Automatic token refresh
- Protected routes using middleware
- Password hashing with bcrypt

### 2. Video Upload System
- Form data handling
- Video metadata extraction
- Automatic channel creation for first upload
- Thumbnail generation/upload

### 3. Responsive Design
- Mobile-first approach
- Bootstrap grid system
- CSS media queries
- Sidebar collapse on mobile

### 4. State Management
- React Context API for global state
- Local state for component-specific data
- API service layer for data fetching

## 🧪 Testing the Application

### Default Test Credentials
After seeding the database:
- **Email**: 
- **Password**: 

### Sample Data
The seed script creates:
- 3 users with channels
- 5 sample videos across different categories
- Channel subscriptions
- Video likes and comments

## 🐛 Common Issues & Solutions

### 1. MongoDB Connection Error
- Check `.env` file for correct MONGODB_URI
- Ensure MongoDB Atlas IP whitelisting
- Verify internet connection

### 2. CORS Errors
- Check backend CORS configuration
- Verify frontend URL in backend CORS settings
- Ensure correct port numbers

### 3. JWT Authentication Issues
- Verify JWT_SECRET in `.env`
- Check token expiration
- Ensure Authorization header format

### 4. Video Upload Issues
- Check file size limits
- Verify file type restrictions
- Ensure uploads directory permissions

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 991px
- **Desktop**: ≥ 992px

## 🎨 Styling Guidelines

- **Colors**: YouTube-like red (#FF0000) for primary actions
- **Typography**: Roboto font family
- **Spacing**: Bootstrap spacing utilities
- **Icons**: Bootstrap Icons

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation on all forms
- XSS protection
- CORS configuration
- Environment variables for sensitive data

## 📈 Performance Optimizations

- Lazy loading for images
- Code splitting with React.lazy()
- Efficient database queries with indexes
- Pagination for video lists
- Memoization for expensive computations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is for educational purposes only. All YouTube trademarks and logos are property of Google LLC.

## 🙏 Acknowledgments

- YouTube for inspiration
- MERN stack community
- Bootstrap for UI components
- MongoDB Atlas for database hosting

## 📞 Support

For issues or questions:
1. Check the Common Issues section above
2. Review the code comments
3. Open an issue on GitHub

## 🏆 Project Completion Checklist

- User Authentication (Register/Login)
- Video Upload & Management
- Channel Creation & Management
- Video Player with Controls
- Comment System
- Like/Dislike Functionality
- Search & Filter Videos
- Responsive Design
- Dark/Light Theme Toggle
- Sidebar Navigation
- Video Categories
- YouTube Studio Dashboard
- Database Seeding
- Error Handling
- Form Validation
- Loading States
- API Documentation


## **📞 Support**

For support, email: souravayrah1@gmail.com or create an issue in the repository.

---

## 📧 Contact

Your Name - Sourav Banerjee 

Project Link: https://github.com/souravbanerjee147/Youtube-clone.git

---

**Happy Coding!** 🚀



what are the thing i need to do assuming i only have the code files, no dependecy nor anyth setup done, just assume i have the code file only, so what steeps i need to take to setup the entire proroject, and initiat the project