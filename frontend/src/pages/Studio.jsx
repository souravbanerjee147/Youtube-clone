
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function Studio() {
  const navigate = useNavigate();

  return (
    <Container fluid className="p-0">
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 fw-bold">YouTube Studio</h1>
          <Button as={Link} to="/upload" variant="danger">
            <i className="bi bi-upload me-2"></i> Upload Video
          </Button>
        </div>

        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <i className="bi bi-graph-up" style={{ fontSize: '3rem', color: '#007bff' }}></i>
                </div>
                <Card.Title>Channel Analytics</Card.Title>
                <Card.Text className="mb-4">
                  View your channel performance, audience insights, and engagement metrics.
                </Card.Text>
                <Button
                  variant="outline-primary"
                  className="w-100"
                  onClick={() => {
                    // Navigate to channel analytics (placeholder)
                    navigate('/channel/1');
                  }}
                >
                  View Analytics
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <i className="bi bi-collection-play" style={{ fontSize: '3rem', color: '#28a745' }}></i>
                </div>
                <Card.Title>Video Manager</Card.Title>
                <Card.Text className="mb-4">
                  Manage your videos, edit details, and check performance of individual videos.
                </Card.Text>
                <Button
                  variant="outline-success"
                  className="w-100"
                  onClick={() => {
                    // Navigate to video management (placeholder)
                    navigate('/channel/1');
                  }}
                >
                  Manage Videos
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <i className="bi bi-chat-dots" style={{ fontSize: '3rem', color: '#dc3545' }}></i>
                </div>
                <Card.Title>Comments</Card.Title>
                <Card.Text className="mb-4">
                  View and respond to comments on your videos.
                </Card.Text>
                <Button
                  variant="outline-danger"
                  className="w-100"
                  onClick={() => {
                    // Navigate to comments 
                    // This would show comments in a modal or separate page
                    alert('Comments feature would open here. In a full implementation, you would see all comments on your videos.');
                  }}
                >
                  View Comments
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="mt-5">
          <Card>
            <Card.Body>
              <h5 className="mb-3">Quick Stats</h5>
              <Row>
                <Col md={3} className="text-center mb-3">
                  <div className="p-3 border rounded">
                    <h6 className="text-muted">Subscribers</h6>
                    <h3 className="fw-bold">1,234</h3>
                  </div>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="p-3 border rounded">
                    <h6 className="text-muted">Total Views</h6>
                    <h3 className="fw-bold">45,678</h3>
                  </div>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="p-3 border rounded">
                    <h6 className="text-muted">Videos</h6>
                    <h3 className="fw-bold">12</h3>
                  </div>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="p-3 border rounded">
                    <h6 className="text-muted">Watch Time</h6>
                    <h3 className="fw-bold">1.2K hrs</h3>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>

        <div className="mt-5 text-center">
          <h5 className="text-muted mb-3">YouTube Studio Features</h5>
          <p className="text-muted">
            This is a simplified version of YouTube Studio.
          </p>
        </div>
      </Container>
    </Container>
  );
}

export default Studio;