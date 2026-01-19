import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import HomePage from './components/home/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VideoDetail from './pages/VideoDetail';
import ChannelPage from './pages/ChannelPage';
import Studio from './pages/Studio';
import UploadVideo from './components/channel/UploadVideo';
import PrivateRoute from './components/common/PrivateRoute';
import SearchResults from './pages/SearchResults';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/common/ThemeToggle';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Pages where sidebar should NOT appear
const noSidebarRoutes = ['/login', '/register'];

// Wrapper component to conditionally show sidebar
const Layout = ({ children, sidebarVisible, setSidebarVisible }) => {
  const location = useLocation();
  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <>
      <Header toggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
      
      {shouldShowSidebar && (
        <>
          {/* Sidebar */}
          <div 
            className={`sidebar-mobile bg-light ${
              sidebarVisible ? 'sidebar-mobile-visible' : 'sidebar-mobile-hidden'
            } ${window.innerWidth >= 992 ? 'd-block' : ''}`}
          >
            <Sidebar onItemClick={() => {
              if (window.innerWidth < 992) {
                setSidebarVisible(false);
              }
            }} />
          </div>
          
          {/* Sidebar overlay for mobile */}
          {sidebarVisible && window.innerWidth < 992 && (
            <div 
              className="sidebar-overlay active"
              onClick={() => setSidebarVisible(false)}
            ></div>
          )}
        </>
      )}
      
      {/* Main Content */}
      <main className={`main-content ${shouldShowSidebar ? '' : 'no-sidebar'}`}>
        {children}
      </main>
    </>
  );
};

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Handle sidebar visibility on resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarVisible(true);
        document.body.classList.remove('sidebar-open');
      } else {
        setSidebarVisible(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle body scroll when sidebar is open
  React.useEffect(() => {
    if (window.innerWidth < 992) {
      if (sidebarVisible) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    }
  }, [sidebarVisible]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App d-flex flex-column min-vh-100">
            <Layout sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible}>
              <Routes>
                <Route path="/" element={
                  <HomePage 
                    sidebarVisible={sidebarVisible} 
                    setSidebarVisible={setSidebarVisible} 
                  />
                } />
                
                {/* Auth pages (no sidebar) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Pages with sidebar */}
                <Route path="/video/:id" element={<VideoDetail />} />
                <Route path="/channel" element={
                  <PrivateRoute>
                    <ChannelPage />
                  </PrivateRoute>
                } />
                <Route path="/channel/:id" element={<ChannelPage />} />
                <Route path="/search" element={<SearchResults />} />
                
                {/* Sidebar Routes */}
                <Route path="/trending" element={
                  <HomePage 
                    sidebarVisible={sidebarVisible} 
                    setSidebarVisible={setSidebarVisible} 
                    defaultFilter="Trending"
                  />
                } />
                <Route path="/subscriptions" element={
                  <HomePage 
                    sidebarVisible={sidebarVisible} 
                    setSidebarVisible={setSidebarVisible} 
                    defaultFilter="Subscriptions"
                  />
                } />
                <Route path="/history" element={
                  <HomePage 
                    sidebarVisible={sidebarVisible} 
                    setSidebarVisible={setSidebarVisible} 
                    defaultFilter="History"
                  />
                } />
                <Route path="/watch-later" element={
                  <HomePage 
                    sidebarVisible={sidebarVisible} 
                    setSidebarVisible={setSidebarVisible} 
                    defaultFilter="Watch Later"
                  />
                } />
                <Route path="/liked-videos" element={
                  <HomePage 
                    sidebarVisible={sidebarVisible} 
                    setSidebarVisible={setSidebarVisible} 
                    defaultFilter="Liked Videos"
                  />
                } />
                
                {/* Category pages */}
                <Route path="/category/:category" element={
                  <HomePage 
                    sidebarVisible={sidebarVisible} 
                    setSidebarVisible={setSidebarVisible} 
                  />
                } />
                
                {/* Other pages */}
                <Route path="/premium" element={
                  <Container className="py-5">
                    <h2>YouTube Premium</h2>
                    <p>This is a placeholder for YouTube Premium page.</p>
                  </Container>
                } />
                <Route path="/music" element={
                  <Container className="py-5">
                    <h2>YouTube Music</h2>
                    <p>This is a placeholder for YouTube Music page.</p>
                  </Container>
                } />
                
                {/* Protected Routes */}
                <Route path="/studio" element={
                  <PrivateRoute>
                    <Studio />
                  </PrivateRoute>
                } />
                <Route path="/upload" element={
                  <PrivateRoute>
                    <UploadVideo />
                  </PrivateRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
            
            <ThemeToggle />
            
            {/* Footer */}
            <footer className="bg-dark text-white py-4 mt-auto">
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <h5>YouTube Clone</h5>
                    <p className="text-muted">
                      This is a MERN stack project for educational purposes.
                    </p>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <p className="text-muted mb-0">
                      &copy; {new Date().getFullYear()} YouTube Clone. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;