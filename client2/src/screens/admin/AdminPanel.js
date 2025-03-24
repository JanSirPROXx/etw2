import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './adminPanel.css';
import { 
  fetchUsersRequest,
  createUserRequest,
  updateUserRequest,
  deleteUserRequest
} from '../../redux/modules/admin/adminActions';
import {
  fetchLocationsRequest,
  createLocationRequest,
  updateLocationRequest,
  deleteLocationRequest
} from '../../redux/modules/location/locationActions';
import LocationsManagement from './LocationsManagement';
import UsersManagement from './UsersManagement';

function AdminPanel() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    // Only fetch if user is admin
    if (user && user.role === 'admin') {
      dispatch(fetchUsersRequest());
      dispatch(fetchLocationsRequest());
    }
  }, [dispatch, user]);

  // Redirect if not admin - after all hooks are called
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'locations' ? 'active' : ''}`}
          onClick={() => setActiveTab('locations')}
        >
          Locations Management
        </button>
      </div>
      
      {activeTab === 'users' ? (
        <UsersManagement />
      ) : (
        <LocationsManagement />
      )}
    </div>
  );
}

export default AdminPanel;