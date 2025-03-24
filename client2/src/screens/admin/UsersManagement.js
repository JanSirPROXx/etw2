import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createUserRequest,
  updateUserRequest,
  deleteUserRequest
} from '../../redux/modules/admin/adminActions';

function UsersManagement() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state.admin);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  });

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '' // Don't fill password for security reasons
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedUser) {
      dispatch(updateUserRequest(selectedUser._id, formData));
    } else {
      dispatch(createUserRequest(formData));
    }
    
    // Reset form
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      password: ''
    });
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUserRequest(userId));
    }
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      password: ''
    });
  };

  return (
    <div className="admin-container">
      <div className="users-list">
        <h2>Users</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button 
                      className="edit-btn" 
                      onClick={() => handleSelectUser(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="user-form">
        <h2>{selectedUser ? 'Edit User' : 'Create New User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {selectedUser ? 'Password (leave empty to keep current)' : 'Password'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!selectedUser}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {selectedUser ? 'Update User' : 'Create User'}
            </button>
            {selectedUser && (
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsersManagement;