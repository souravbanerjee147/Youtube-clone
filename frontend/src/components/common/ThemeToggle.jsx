import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTheme } from '../../context/ThemeContext';

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Button
      variant="danger"
      className="theme-toggle-btn shadow"
      onClick={toggleTheme}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <i className="bi bi-sun-fill fs-5"></i>
      ) : (
        <i className="bi bi-moon-fill fs-5"></i>
      )}
    </Button>
  );
}

export default ThemeToggle;