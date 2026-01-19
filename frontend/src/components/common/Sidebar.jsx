import React, { useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../context/AuthContext';

function Sidebar({ onItemClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleNavigation = (path) => {
    navigate(path);
    if (onItemClick) onItemClick();
  };

  const handleCategoryFilter = (category) => {
    // Navigate to homepage with category filter
    navigate(`/?category=${category}`);
    if (onItemClick) onItemClick();
  };

  const menuItems = [
    { id: 1, icon: 'bi-house-door', label: 'Home', path: '/' },
    { id: 2, icon: 'bi-fire', label: 'Trending', path: '/trending' },
    { id: 3, icon: 'bi-collection-play', label: 'Subscriptions', path: '/subscriptions' },
  ];

  // Add authenticated-only items
  if (user) {
    menuItems.push(
      { id: 4, icon: 'bi-clock-history', label: 'History', path: '/history' },
      { id: 5, icon: 'bi-clock', label: 'Watch Later', path: '/watch-later' },
      { id: 6, icon: 'bi-hand-thumbs-up', label: 'Liked Videos', path: '/liked-videos' }
    );
  }

  const exploreItems = [
    { id: 7, label: 'Music', category: 'Music' },
    { id: 8, label: 'Gaming', category: 'Gaming' },
    { id: 9, label: 'News', category: 'News' },
    { id: 10, label: 'Sports', category: 'Sports' },
    { id: 11, label: 'Learning', category: 'Education' },
    { id: 12, label: 'Technology', category: 'Technology' },
    { id: 13, label: 'Entertainment', category: 'Entertainment' },
  ];

  return (
    <div className="vh-100" style={{ width: '240px' }}>
      <ListGroup variant="flush" className="border-0">
        {menuItems.map((item) => (
          <ListGroup.Item 
            key={item.id}
            action
            className={`border-0 py-3 px-4 d-flex align-items-center ${
              location.pathname === item.path ? 'bg-danger text-white fw-bold' : 'text-dark'
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            <i className={`bi ${item.icon} me-3`} style={{ width: '24px' }}></i>
            <span>{item.label}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <hr className="my-2" />

      <div className="px-4 py-2">
        <h6 className="text-uppercase text-muted small fw-bold mb-3">Explore</h6>
        <div className="d-flex flex-column gap-2">
          {exploreItems.map((item) => (
            <Button
              key={item.id}
              variant="outline-secondary"
              size="sm"
              className="rounded-pill px-3 text-start"
              onClick={() => handleCategoryFilter(item.category)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {user && (
        <>
          <hr className="my-2" />
          <ListGroup variant="flush" className="border-0">
            <ListGroup.Item 
              action
              className="border-0 py-3 px-4 d-flex align-items-center text-dark"
              onClick={() => handleNavigation('/channel')}
            >
              <i className="bi bi-person-circle me-3"></i>
              <span>Your Channel</span>
            </ListGroup.Item>
            <ListGroup.Item 
              action
              className="border-0 py-3 px-4 d-flex align-items-center text-dark"
              onClick={() => handleNavigation('/studio')}
            >
              <i className="bi bi-camera-video me-3"></i>
              <span>YouTube Studio</span>
            </ListGroup.Item>
          </ListGroup>
        </>
      )}

      <hr className="my-2" />

      <div className="px-4 py-2">
        <h6 className="text-uppercase text-muted small fw-bold mb-3">More from YouTube</h6>
        <ListGroup variant="flush" className="border-0">
          <ListGroup.Item 
            action
            className="border-0 py-2 px-0 text-dark"
            onClick={() => handleNavigation('/premium')}
          >
            <i className="bi bi-youtube me-3 text-danger"></i>
            YouTube Premium
          </ListGroup.Item>
          <ListGroup.Item 
            action
            className="border-0 py-2 px-0 text-dark"
            onClick={() => handleNavigation('/music')}
          >
            <i className="bi bi-music-note-beamed me-3 text-danger"></i>
            YouTube Music
          </ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
}

export default Sidebar;