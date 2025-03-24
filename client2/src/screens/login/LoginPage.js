import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './loginPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../../redux/modules/auth/authActions';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error, user} = useSelector(state => state.auth);

  //redirect if already logged in
  useEffect(() => {
    if(user){
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
   e.preventDefault();
   dispatch(loginRequest(formData))
  };

  return (
    <div className="login-container">
    <div className="login-form-container">
      <h1>Welcome Back</h1>
      <p className="subtitle">Sign in to your account</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />
        </div>
        
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <p className="register-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  </div>
  );
}

export default LoginPage;