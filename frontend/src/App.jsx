import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Pages using standard relative paths from the current file's location.
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Recommend from './pages/Recommend.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import NotFound from './pages/NotFound.jsx';

// Import Components using standard relative paths.
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <>
      {/* Toaster provides pop-up notifications throughout the app */}
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* The <Routes> component defines all the possible pages in your application.
        The <BrowserRouter> has been removed from this file and should only exist
        in your main.jsx file, wrapping this <App /> component.
      */}
      <Routes>
        {/* =================================================================== */}
        {/* Public Routes - Accessible to everyone                          */}
        {/* =================================================================== */}
        <Route path="/" element={<LandingPage />} />
        
        {/* The AuthPage handles both Login and Registration */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* =================================================================== */}
        {/* Protected Routes - Require authentication                       */}
        {/* =================================================================== */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Navbar />
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recommend" 
          element={
            <ProtectedRoute>
              <Navbar />
              <Recommend />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Navbar />
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        
        {/* =================================================================== */}
        {/* Not Found Route                                                   */}
        {/* =================================================================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
