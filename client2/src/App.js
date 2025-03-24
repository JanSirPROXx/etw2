import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from './redux/modules/auth/authActions';
import Navigation from './components/navigation/Navigation';
import LoginPage from './screens/login/LoginPage';
import RegisterPage from './screens/register/RegisterPage';
// import './App.css';

//screens
import ExplorePage from './screens/explore/ExplorePage';
import AdminPanel from './screens/admin/AdminPanel';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
          <Route path="/" element={<div className="home-container"><h1>Welcome to Explore the World</h1></div>} />
          <Route path="/explore" element={<div className="explore-container"><ExplorePage/></div>} />
          <Route path="/about" element={<div className="about-container"><h1>About Us</h1></div>} />
          <Route path="/admin" element={<AdminPanel/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;