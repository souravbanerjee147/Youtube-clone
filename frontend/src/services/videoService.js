import api from './api';

// Get all videos
export const fetchVideos = async (category = '', search = '', page = 1, limit = 12) => {
  try {
    let url = `/videos?page=${page}&limit=${limit}`;
    if (category && category !== 'All') {
      url += `&category=${category}`;
    }
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await api.get(url);
    return response.data.videos || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

// Get video by ID
export const fetchVideo = async (id) => {
  try {
    console.log('Fetching video with ID:', id);
    const response = await api.get(`/videos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
};

// Search videos
export const searchVideos = async (query) => {
  try {
    const response = await api.get(`/videos/search?q=${encodeURIComponent(query)}`);
    return response.data.videos || [];
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
};



export const fetchChannel = async (id) => {
  try {
    if (!id) {
      console.error('No channel ID provided');
      return null;
    }

    const response = await api.get(`/channels/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching channel:', error);
    return null;
  }
};


// Get current user's channel
export const fetchUserChannel = async () => {
  try {
    const response = await api.get('/channels/user/current');
    return response.data;
  } catch (error) {
    console.error('Error fetching user channel:', error);
    return null;
  }
};



export const fetchChannelVideos = async (channelId) => {
  try {
    if (!channelId) {
      console.error('No channel ID provided');
      return [];
    }

    const response = await api.get(`/videos/channel/${channelId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return [];
  }
};



// Upload video
export const uploadVideo = async (videoData) => {
  try {
    const response = await api.post('/videos', videoData);
    return response.data;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

// Update video
export const updateVideo = async (videoId, updateData) => {
  try {
    const response = await api.put(`/videos/${videoId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

// Delete video
export const deleteVideo = async (videoId) => {
  try {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

// Like/Dislike video
export const likeVideo = async (videoId, action) => {
  try {
    const response = await api.post(`/videos/${videoId}/like`, { action });
    return response.data;
  } catch (error) {
    console.error('Error liking video:', error);
    throw error;
  }
};

// Add comment
export const addComment = async (videoId, text) => {
  try {
    const response = await api.post(`/comments/video/${videoId}`, { text });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get comments
export const fetchComments = async (videoId) => {
  try {
    const response = await api.get(`/comments/video/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};