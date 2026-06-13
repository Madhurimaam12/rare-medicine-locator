import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import PharmacyOrders from './pages/PharmacyOrders';
import MyOrders from './pages/MyOrders';

// This component handles token validation
const AppContent = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Check if token is valid (not expired)
  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          if (payload.exp * 1000 < Date.now()) {
            localStorage.clear();
            navigate('/landing');
          }
        } catch (e) {
          localStorage.clear();
          navigate('/landing');
        }
      }
    };
    checkToken();
  }, [navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes - require login */}
      <Route path="/" element={token ? <Home /> : <Navigate to="/landing" />} />
      <Route path="/dashboard" element={token && userRole === 'pharmacy' ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/requests" element={token ? <Requests /> : <Navigate to="/landing" />} />
      
      {/* Order & Billing Routes */}
      <Route path="/pharmacy-orders" element={token && userRole === 'pharmacy' ? <PharmacyOrders /> : <Navigate to="/" />} />
      <Route path="/my-orders" element={token ? <MyOrders /> : <Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;