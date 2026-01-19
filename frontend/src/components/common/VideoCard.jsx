import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { formatViews } from '../../utils/helpers';

function VideoCard({ video }) {
  // Make sure video has _id
  const videoId = video._id || video.id || '1';

  // Format time if video has duration
  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Use a default thumbnail
  const getThumbnailUrl = () => {
    if (video.thumbnailUrl && !video.thumbnailUrl.includes('via.placeholder.com')) {
      return video.thumbnailUrl;
    }
    return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=320&h=180&fit=crop';
  };

  return (
    <Card className="border-0 bg-transparent h-100">
      <div className="position-relative">
        <Link to={`/video/${videoId}`} className="text-decoration-none">
          <Card.Img
            variant="top"
            src={getThumbnailUrl()}
            alt={video.title}
            className="rounded-3"
            style={{
              height: '180px',
              objectFit: 'cover',
              width: '100%'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=320&h=180&fit=crop';
            }}
          />
        </Link>

        {/* Video Duration Badge */}
        {video.duration && (
          <div className="position-absolute bottom-0 end-0 m-2 bg-dark text-white rounded-1 px-1"
            style={{ fontSize: '0.75rem', opacity: 0.9 }}>
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      <Card.Body className="p-2">
        <div className="d-flex">
          <div className="flex-shrink-0 me-3">
            <Link to={`/channel/${video.channel?._id || video.channel || 'channel01'}`} className="text-decoration-none">
              <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px' }}>
                <span className="text-white fw-bold small">
                  {video.channel?.channelName?.charAt(0) || 'C'}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex-grow-1">
            <Link to={`/video/${videoId}`} className="text-decoration-none text-dark">
              <Card.Title className="fs-6 fw-bold mb-1"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                {video.title}
              </Card.Title>
            </Link>

            <Card.Text className="text-muted small mb-1">
              <Link to={`/channel/${video.channel?._id || video.channel || 'channel01'}`}
                className="text-decoration-none text-muted">
                {video.channel?.channelName || 'Unknown Channel'}
              </Link>
            </Card.Text>

            <Card.Text className="text-muted small mb-0">
              {formatViews(video.views || 0)} views • {new Date(video.uploadDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </Card.Text>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default VideoCard;