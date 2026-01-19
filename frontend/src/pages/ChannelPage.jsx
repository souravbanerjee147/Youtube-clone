import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useAuth } from '../context/AuthContext';
import { fetchChannelVideos, deleteVideo, updateVideo } from '../services/videoService';

function ChannelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('videos');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: 'Entertainment'
  });
  const [editLoading, setEditLoading] = useState(false);

  // Determine if this is the current user's channel
  const isCurrentUserChannel = () => {
    if (!user || !user.channel) return false;
    if (!id) return true; // No ID means it's the current user's channel
    return user.channel._id === id;
  };

  useEffect(() => {
    loadChannelData();
  }, [id, user]);

  const loadChannelData = async () => {
    setLoading(true);
    setError('');
    
    try {
      let channelId;
      
      if (id) {
        // If ID is provided in URL, use it
        channelId = id;
      } else if (user?.channel?._id) {
        // If no ID but user has channel, use user's channel
        channelId = user.channel._id;
      } else {
        // If no channel exists, show message
        setError('Channel not found. Please upload a video first.');
        setVideos([]);
        setLoading(false);
        return;
      }
      
      const videosData = await fetchChannelVideos(channelId);
      setVideos(videosData);
    } catch (error) {
      console.error('Error loading channel videos:', error);
      setError('Failed to load channel videos. Please try again.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(videoId);
        // Remove video from state
        setVideos(videos.filter(video => video._id !== videoId));
        alert('Video deleted successfully!');
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Failed to delete video. Please try again.');
      }
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setEditFormData({
      title: video.title,
      description: video.description,
      category: video.category || 'Entertainment'
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    
    try {
      await updateVideo(editingVideo._id, editFormData);
      
      // Update video in state
      setVideos(videos.map(video => 
        video._id === editingVideo._id 
          ? { ...video, ...editFormData, updatedAt: new Date().toISOString() }
          : video
      ));
      
      setShowEditModal(false);
      alert('Video updated successfully!');
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Failed to update video. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading channel...</p>
      </Container>
    );
  }

  const channel = user?.channel || {
    _id: id || 'unknown',
    channelName: user?.username ? `${user.username}'s Channel` : 'Unknown Channel',
    description: 'Welcome to our channel!',
    channelBanner: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1920&h=250&fit=crop',
    avatar: user?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    subscribers: [],
    createdAt: new Date().toISOString()
  };

  const isCurrentUser = isCurrentUserChannel();

  return (
    <Container fluid className="p-0">
      {/* Channel Banner */}
      <div 
        className="channel-banner" 
        style={{
          height: '200px',
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${channel.channelBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      <Container className="py-4">
        {error && (
          <Alert variant="warning" className="mb-4">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {/* Channel Info */}
        <Row className="mb-4">
          <Col md={3} className="text-center text-md-start mb-3 mb-md-0">
            <div className="channel-avatar mb-3">
              <img 
                src={channel.avatar} 
                alt={channel.channelName}
                className="rounded-circle"
                style={{ 
                  width: '100px', 
                  height: '100px',
                  objectFit: 'cover',
                  border: '3px solid #fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                }}
              />
            </div>
          </Col>
          
          <Col md={9}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
              <div>
                <h1 className="h2 fw-bold mb-1">{channel.channelName}</h1>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                  <span className="text-muted">@{user?.username || 'user'}</span>
                  <Badge bg="secondary" className="rounded-pill">
                    {formatNumber(channel.subscribers?.length || 0)} subscribers
                  </Badge>
                  <Badge bg="light" text="dark" className="rounded-pill">
                    {videos.length} video{videos.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
              
              <div className="d-flex gap-2 mt-2 mt-md-0">
                {isCurrentUser ? (
                  <>
                    <Button as={Link} to="/upload" variant="danger" size="sm">
                      <i className="bi bi-upload me-1"></i> Upload Video
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate('/studio')}>
                      <i className="bi bi-gear me-1"></i> Studio
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="danger" size="sm">
                      <i className="bi bi-bell-fill me-1"></i> Subscribe
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      <i className="bi bi-share me-1"></i> Share
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <p className="text-muted mb-0">
              {channel.description || 'No description available.'}
            </p>
          </Col>
        </Row>

        {/* Channel Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
          id="channel-tabs"
        >
          <Tab eventKey="videos" title="Videos">
            <div className="mt-4">
              {videos.length > 0 ? (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                  {videos.map((video) => (
                    <Col key={video._id}>
                      <Card className="h-100 border-0 shadow-sm hover-shadow">
                        <Link to={`/video/${video._id}`} className="text-decoration-none">
                          <Card.Img 
                            variant="top" 
                            src={video.thumbnailUrl} 
                            alt={video.title}
                            style={{ height: '160px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=320&h=180&fit=crop';
                            }}
                          />
                        </Link>
                        <Card.Body>
                          <Card.Title className="fs-6 fw-bold mb-2">
                            <Link to={`/video/${video._id}`} className="text-decoration-none text-dark">
                              {video.title}
                            </Link>
                          </Card.Title>
                          <Card.Text className="text-muted small mb-1">
                            {formatNumber(video.views || 0)} views • {formatDate(video.createdAt)}
                          </Card.Text>
                          {video.category && (
                            <Badge bg="light" text="dark" className="small">
                              {video.category}
                            </Badge>
                          )}
                        </Card.Body>
                        {isCurrentUser && (
                          <Card.Footer className="bg-transparent border-0 pt-0">
                            <div className="d-flex justify-content-end gap-2">
                              <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={() => handleEdit(video)}
                                title="Edit video"
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDelete(video._id)}
                                title="Delete video"
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </Card.Footer>
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="bi bi-camera-video-off text-muted" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h4 className="text-muted mb-3">No videos yet</h4>
                  <p className="text-muted mb-4">
                    {isCurrentUser 
                      ? "You haven't uploaded any videos yet." 
                      : "This channel hasn't uploaded any videos yet."
                    }
                  </p>
                  {isCurrentUser && (
                    <Button as={Link} to="/upload" variant="danger">
                      <i className="bi bi-upload me-1"></i> Upload Your First Video
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Tab>
          
          <Tab eventKey="about" title="About">
            <div className="mt-4">
              <Card>
                <Card.Body>
                  <h5 className="mb-3">About this channel</h5>
                  <p className="mb-4">{channel.description || 'No description provided.'}</p>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-muted mb-3">Channel Details</h6>
                      <ul className="list-unstyled">
                        <li className="mb-2 d-flex align-items-center">
                          <i className="bi bi-calendar me-3 text-danger"></i>
                          <div>
                            <small className="text-muted d-block">Joined</small>
                            <span>{formatDate(channel.createdAt)}</span>
                          </div>
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <i className="bi bi-people me-3 text-danger"></i>
                          <div>
                            <small className="text-muted d-block">Subscribers</small>
                            <span>{formatNumber(channel.subscribers?.length || 0)}</span>
                          </div>
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <i className="bi bi-camera-video me-3 text-danger"></i>
                          <div>
                            <small className="text-muted d-block">Total videos</small>
                            <span>{videos.length}</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </Container>

      {/* Edit Video Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Video</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={editFormData.category}
                onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="Education">Education</option>
                <option value="Technology">Technology</option>
                <option value="Sports">Sports</option>
                <option value="News">News</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default ChannelPage;