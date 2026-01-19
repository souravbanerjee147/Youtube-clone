import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import VideoCard from '../common/VideoCard';
import { fetchVideos } from '../../services/videoService';

function HomePage({ defaultFilter = 'All' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [filter, setFilter] = useState(searchParams.get('category') || defaultFilter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const categories = ['All', 'Music', 'Gaming', 'Education', 'Entertainment', 'Technology', 'Sports', 'News', 'Live'];

  useEffect(() => {
    // Update filter from URL params
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setFilter(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    loadVideos();
  }, [filter]);

  const loadVideos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchVideos(filter === 'All' ? '' : filter);
      setVideos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading videos:', error);
      setError('Failed to load videos. Please try again.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setFilter(category);
    // Update URL with category parameter
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <Container fluid className="p-3">
      {/* Category Filter Buttons */}
      <div className="d-flex flex-nowrap overflow-auto mb-4 pb-2" style={{ 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        maxWidth: '100%'
      }}>
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "dark" : "outline-secondary"}
            size="sm"
            onClick={() => handleCategoryChange(category)}
            className="rounded-pill px-3 me-2 flex-shrink-0"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading videos...</p>
        </div>
      ) : (
        <>
          {/* Responsive Video Grid */}
          <Row xs={1} sm={2} md={2} lg={3} xl={4} xxl={5} className="g-3">
            {videos && videos.length > 0 ? (
              videos.map((video) => (
                <Col key={video._id || video.id} className="mb-4">
                  <VideoCard video={video} />
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="bi bi-camera-video-off text-muted" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h4 className="text-muted">No videos found</h4>
                  <p className="text-muted">Try a different filter or upload a video</p>
                  <Button variant="primary" as="a" href="/upload">
                    Upload Video
                  </Button>
                </div>
              </Col>
            )}
          </Row>
        </>
      )}
    </Container>
  );
}

export default HomePage;