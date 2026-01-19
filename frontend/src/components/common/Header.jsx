import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { useAuth } from '../../context/AuthContext';

function Header({ toggleSidebar }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        {/* Hamburger Menu and Logo */}
        <div className="d-flex align-items-center">
          <Button
            variant="outline-secondary"
            className="border-0 me-2 d-lg-none"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list"></i>
          </Button>

          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center me-4">
            <span className="text-danger fw-bold fs-4">You</span>
            <span className="text-white fs-4">Tube</span>
          </Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          {/* Search Bar */}
          <Form className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: '600px', width: '100%' }} onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search videos..."
                className="rounded-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-secondary" type="submit" className="rounded-0 border-start-0">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form>

          {/* User Actions */}
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <Button
                  as={Link}
                  to="/upload"
                  variant="outline-light"
                  className="me-3 d-none d-md-inline-flex align-items-center"
                >
                  <i className="bi bi-upload me-1"></i> Upload
                </Button>

                <Dropdown align="end">
                  <Dropdown.Toggle variant="dark" id="dropdown-user" className="border-0">
                    <div className="d-flex align-items-center">
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="rounded-circle"
                        style={{
                          width: '32px',
                          height: '32px',
                          objectFit: 'cover',
                          marginRight: '8px'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                        }}
                      />
                      <span className="ms-2 d-none d-md-inline">{user.username}</span>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/channel">
                      <i className="bi bi-person-circle me-2"></i> Your Channel
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/studio">
                      <i className="bi bi-camera-video me-2"></i> YouTube Studio
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-3">
                  <Button variant="outline-light" className="rounded-pill px-3">
                    <i className="bi bi-person me-1"></i> Sign In
                  </Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <Button variant="danger" className="rounded-pill px-3">
                    <i className="bi bi-person-plus me-1"></i> Sign Up
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;