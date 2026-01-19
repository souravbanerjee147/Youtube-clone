import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import VideoCard from '../components/common/VideoCard';
import { searchVideos } from '../services/videoService';

function SearchResults() {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';
    setSearchQuery(query);
    
    if (query) {
      loadSearchResults(query);
    } else {
      setVideos([]);
      setLoading(false);
    }
  }, [location.search]);

  const loadSearchResults = async (query) => {
    setLoading(true);
    try {
      const data = await searchVideos(query);
      setVideos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2 className="h4 fw-bold">
          Search Results for: <span className="text-danger">"{searchQuery}"</span>
        </h2>
        <p className="text-muted">
          {videos.length} video{videos.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Searching videos...</p>
        </div>
      ) : videos.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
          {videos.map((video) => (
            <Col key={video._id}>
              <VideoCard video={video} />
            </Col>
          ))}
        </Row>
      ) : searchQuery ? (
        <Card className="text-center py-5">
          <Card.Body>
            <div className="mb-3">
              <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
            </div>
            <h4 className="text-muted mb-3">No videos found</h4>
            <p className="text-muted mb-4">
              Try different keywords or check the spelling
            </p>
            <Button as={Link} to="/" variant="outline-secondary">
              <i className="bi bi-house me-1"></i> Back to Home
            </Button>
          </Card.Body>
        </Card>
      ) : null}
    </Container>
  );
}

export default SearchResults;