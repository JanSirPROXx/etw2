import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/modules/auth/authActions";
import './navigation.css';

const Navigation = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    }

    return (
        <nav className="navigation">
      <div className="nav-brand">
        <a href="/">Explore the World</a>
      </div>
      
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/explore">Explore</a></li>
        <li><a href="/about">About</a></li>
      </ul>
      
      <div className="nav-auth">
        {user ? (
          <>
            <span className="welcome-user">Welcome, {user.name || 'User'}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <a href="/login" className="login-btn">Login</a>
            <a href="/register" className="register-btn">Register</a>
          </>
        )}
      </div>
    </nav>
    )
}

export default Navigation;