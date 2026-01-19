import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { AuthContext } from '../../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5} xl={4}>
          <Card className="shadow border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <span className="text-danger fw-bold fs-3">You</span>
                  <span className="text-dark fs-3">Tube</span>
                </div>
                <h2 className="h4 fw-bold">Sign in</h2>
                <p className="text-muted">to continue to YouTube</p>
              </div>

              {error && (
                <Alert variant="danger" className="py-2">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="text-end mt-2">
                    <Link to="/forgot-password" className="text-decoration-none small">
                      Forgot password?
                    </Link>
                  </div>
                </Form.Group>

                <div className="d-grid mb-4">
                  <Button 
                    variant="danger" 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : 'Sign in'}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-muted mb-2">Don't have an account?</p>
                  <Button 
                    as={Link} 
                    to="/register" 
                    variant="outline-dark"
                    className="w-100"
                  >
                    Create account
                  </Button>
                </div>
              </Form>

              <hr className="my-4" />

              <div className="text-center">
                <small className="text-muted">
                  By signing in, you agree to YouTube's 
                  <Link to="/terms" className="text-decoration-none ms-1">Terms of Service</Link> and 
                  <Link to="/privacy" className="text-decoration-none ms-1">Privacy Policy</Link>
                </small>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <small className="text-muted">
              This is a YouTube clone project for educational purposes.
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;