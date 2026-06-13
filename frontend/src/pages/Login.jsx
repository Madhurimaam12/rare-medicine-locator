import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('userName', response.data.user.name);
      localStorage.setItem('userRole', response.data.user.role);
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Clear field on focus (agar autofill ho gaya toh user click karega toh clear ho jayega)
  const handleEmailFocus = () => {
    if (email === 'happy@gmail.com' || email.includes('happy')) {
      setEmail('');
    }
  };

  const handlePasswordFocus = () => {
    if (password === 'password123' || (password && password.length < 3)) {
      setPassword('');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '400px' }}>
        <div className="text-center mb-4">
          <h2 className="h4">Rare Medicine Locator</h2>
          <p className="text-muted small">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              ref={emailRef}
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleEmailFocus}
              autoComplete="new-password"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              ref={passwordRef}
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handlePasswordFocus}
              autoComplete="new-password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p className="mb-0">
            Don't have an account? <Link to="/register" className="text-decoration-none">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;