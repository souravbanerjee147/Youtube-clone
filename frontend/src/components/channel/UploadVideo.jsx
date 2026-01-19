import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { uploadVideo } from '../../services/videoService';

function UploadVideo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Entertainment'
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      // Create preview URL
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
    }
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      // Create preview URL
      const imageURL = URL.createObjectURL(file);
      setThumbnailPreview(imageURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('video', videoFile);

    if (thumbnailFile) {
      data.append('thumbnail', thumbnailFile);
    }

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadVideo(data);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setSuccess('Video uploaded successfully! Redirecting to homepage...');

      // Clean up preview URLs
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="h3 fw-bold">Upload Video</h2>
                <p className="text-muted">Post a video to your channel</p>
              </div>

              {error && (
                <Alert variant="danger" className="py-2">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="py-2">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                </Alert>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-4">
                  <ProgressBar
                    now={uploadProgress}
                    label={`${uploadProgress}%`}
                    variant="danger"
                    animated
                  />
                  <small className="text-muted mt-1 d-block">Uploading video...</small>
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    {/* Video File Upload */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">Video File *</Form.Label>
                      <Form.Control
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        required
                      />
                      <Form.Text className="text-muted">
                        Upload your video file (MP4, MOV, AVI, WebM up to 100MB)
                      </Form.Text>
                    </Form.Group>

                    {/* Thumbnail Upload */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">Thumbnail</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailFileChange}
                      />
                      <Form.Text className="text-muted">
                        Upload a custom thumbnail (optional, JPG/PNG)
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    {/* Previews */}
                    <div className="mb-4">
                      {videoPreview && (
                        <div className="mb-3">
                          <Form.Label className="fw-bold">Video Preview</Form.Label>
                          <div className="ratio ratio-16x9 border rounded overflow-hidden">
                            <video
                              src={videoPreview}
                              controls
                              style={{ maxHeight: '200px' }}
                            />
                          </div>
                        </div>
                      )}

                      {thumbnailPreview && (
                        <div>
                          <Form.Label className="fw-bold">Thumbnail Preview</Form.Label>
                          <div className="border rounded overflow-hidden" style={{ maxHeight: '150px' }}>
                            <img
                              src={thumbnailPreview}
                              alt="Thumbnail preview"
                              className="img-fluid w-100"
                              style={{ objectFit: 'cover', height: '150px' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>

                {/* Title */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter video title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Tell viewers about your video"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Category */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
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

                {/* Buttons */}
                <div className="d-grid gap-2">
                  <Button
                    variant="danger"
                    type="submit"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Uploading...
                      </>
                    ) : 'Upload Video'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/channel/channel01')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UploadVideo;