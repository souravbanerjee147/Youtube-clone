import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Loader = ({ size = 'md', text = 'Loading...', fullscreen = false }) => {
  const spinnerSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : undefined;
  
  if (fullscreen) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="danger" size={spinnerSize} />
          {text && <p className="mt-3 text-muted">{text}</p>}
        </div>
      </div>
    );
  }
  
  return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <div className="text-center">
        <Spinner animation="border" variant="danger" size={spinnerSize} />
        {text && <p className="mt-2 small text-muted">{text}</p>}
      </div>
    </div>
  );
};

export default Loader;