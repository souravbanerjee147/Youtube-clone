
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { AuthContext } from '../context/AuthContext';
import { fetchVideo, likeVideo, addComment } from '../services/videoService';

function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    loadVideo();
  }, [id]);

  const loadVideo = async () => {
    setLoading(true);
    try {
      const data = await fetchVideo(id);
      setVideo(data);
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await likeVideo(id, 'like');
      setVideo(prev => ({
        ...prev,
        likes: liked ? prev.likes - 1 : prev.likes + 1,
        dislikes: disliked ? prev.dislikes - 1 : prev.dislikes
      }));
      setLiked(!liked);
      setDisliked(false);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await likeVideo(id, 'dislike');
      setVideo(prev => ({
        ...prev,
        dislikes: disliked ? prev.dislikes - 1 : prev.dislikes + 1,
        likes: liked ? prev.likes - 1 : prev.likes
      }));
      setDisliked(!disliked);
      setLiked(false);
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!comment.trim()) return;

    try {
      const newComment = await addComment(id, comment);
      setVideo(prev => ({
        ...prev,
        comments: [newComment, ...prev.comments]
      }));
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!video) {
    return (
      <Container className="py-5 text-center">
        <h3>Video not found</h3>
        <Button as={Link} to="/" variant="primary">
          Go Home
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      <Container className="py-4">
        <Row>
          {/* Video Player */}
          <Col lg={8}>
            {/* Fixed Video Player */}
            <div className="ratio ratio-16x9 mb-4 bg-dark rounded-3 overflow-hidden">
              {video.videoUrl && (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')) ? (
                // YouTube embed
                <iframe
                  src={video.videoUrl.replace('watch?v=', 'embed/')}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-0"
                ></iframe>
              ) : video.videoUrl && (video.videoUrl.endsWith('.mp4') || video.videoUrl.includes('/uploads/')) ? (
                // HTML5 video player for uploaded videos
                <video
                  controls
                  autoPlay
                  className="w-100 h-100"
                  style={{ objectFit: 'contain' }}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  <source src={video.videoUrl} type="video/webm" />
                  <source src={video.videoUrl} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              ) : video.videoUrl ? (
                // Generic iframe for other URLs
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  allowFullScreen
                  className="border-0"
                ></iframe>
              ) : (
                // Fallback if no video URL
                <div className="d-flex justify-content-center align-items-center h-100 text-white">
                  <div className="text-center">
                    <i className="bi bi-camera-video-off" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-2">No video available</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <h4 className="fw-bold mb-2">{video.title}</h4>

              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center mb-2 mb-md-0">
                  <Badge bg="secondary" className="me-2">
                    {formatNumber(video.views || 0)} views
                  </Badge>
                  <Badge bg="light" text="dark">
                    {new Date(video.uploadDate).toLocaleDateString()}
                  </Badge>
                </div>

                <div className="d-flex">
                  <Button
                    variant={liked ? "danger" : "outline-secondary"}
                    className="me-2"
                    onClick={handleLike}
                  >
                    <i className="bi bi-hand-thumbs-up me-1"></i> {formatNumber(video.likes || 0)}
                  </Button>
                  <Button
                    variant={disliked ? "dark" : "outline-secondary"}
                    onClick={handleDislike}
                  >
                    <i className="bi bi-hand-thumbs-down me-1"></i> {formatNumber(video.dislikes || 0)}
                  </Button>
                  <Button variant="outline-secondary" className="ms-2">
                    <i className="bi bi-share me-1"></i> Share
                  </Button>
                </div>
              </div>

              {/* Channel Info */}
              <Card className="mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-secondary me-3 d-flex align-items-center justify-content-center"
                        style={{ width: '50px', height: '50px' }}>
                        <span className="text-white fw-bold">
                          {video.channel?.channelName?.charAt(0) || 'C'}
                        </span>
                      </div>
                      <div>
                        <h6 className="mb-0">{video.channel?.channelName || 'Unknown Channel'}</h6>
                        <small className="text-muted">
                          {formatNumber(video.channel?.subscribers || 0)} subscribers
                        </small>
                      </div>
                    </div>
                    <Button variant="danger" size="sm">
                      Subscribe
                    </Button>
                  </div>

                  <div className="mt-3">
                    <p className="mb-0">{video.description}</p>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Comments Section */}
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">
                    {video.comments?.length || 0} Comments
                  </h5>
                  <Button variant="outline-secondary" size="sm">
                    <i className="bi bi-filter me-1"></i> Sort by
                  </Button>
                </div>

                {/* Add Comment Form */}
                {user ? (
                  <Form className="mb-4" onSubmit={handleSubmitComment}>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                          style={{ width: '40px', height: '40px' }}>
                          <span className="text-white fw-bold">
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Add a public comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="mb-2"
                          />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="secondary"
                            className="me-2"
                            onClick={() => setComment('')}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="danger"
                            type="submit"
                            disabled={!comment.trim()}
                          >
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                ) : (
                  <div className="text-center py-3 mb-4 border rounded">
                    <p className="mb-2">Want to join the conversation?</p>
                    <Button as={Link} to="/login" variant="outline-danger">
                      Sign in to comment
                    </Button>
                  </div>
                )}

                {/* Comments List */}
                <div className="comments-list">
                  {video.comments?.length > 0 ? (
                    video.comments.map((commentItem) => (
                      <div key={commentItem._id} className="d-flex mb-4">
                        <div className="flex-shrink-0 me-3">
                          <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px' }}>
                            <span className="text-white fw-bold">
                              {commentItem.user?.username?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="mb-0">{commentItem.user?.username || 'User'}</h6>
                            <small className="text-muted">
                              {new Date(commentItem.timestamp).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="mb-2">{commentItem.text}</p>
                          <div className="d-flex align-items-center">
                            <Button variant="link" size="sm" className="text-decoration-none p-0 me-3">
                              <i className="bi bi-hand-thumbs-up"></i> {commentItem.likes || 0}
                            </Button>
                            <Button variant="link" size="sm" className="text-decoration-none p-0">
                              <i className="bi bi-hand-thumbs-down"></i>
                            </Button>
                            <Button variant="link" size="sm" className="text-decoration-none p-0 ms-3">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-chat-text text-muted" style={{ fontSize: '2rem' }}></i>
                      <p className="text-muted mt-2">No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Recommended Videos Sidebar */}
          <Col lg={4} className="mt-4 mt-lg-0">
            <h5 className="mb-3">Recommended Videos</h5>
            <div className="recommended-videos">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="d-flex mb-3">
                  <div className="flex-shrink-0 me-3">
                    <div className="bg-secondary rounded"
                      style={{ width: '120px', height: '70px' }}></div>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fs-6 mb-1">Recommended Video Title {item}</h6>
                    <p className="text-muted small mb-1">Channel Name</p>
                    <p className="text-muted small mb-0">100K views • 1 day ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default VideoDetail;