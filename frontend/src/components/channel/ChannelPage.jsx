
// Use a fixed ID or fetch user's channel
const channelId = id || 'channel01'; // Use default channel ID

// In loadChannelData:
const [channelData, videosData] = await Promise.all([
  fetchChannel(channelId),
  fetchChannelVideos(channelId)
]);