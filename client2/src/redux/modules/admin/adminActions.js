import * as types from './types';

// Fetch all users
export const fetchUsersRequest = () => ({
  type: types.FETCH_USERS_REQUEST
});

export const fetchUsersSuccess = (users) => ({
  type: types.FETCH_USERS_SUCCESS,
  payload: users
});

export const fetchUsersFailure = (error) => ({
  type: types.FETCH_USERS_FAILURE,
  payload: error
});

// Create user
export const createUserRequest = (userData) => ({
  type: types.CREATE_USER_REQUEST,
  payload: userData
});

export const createUserSuccess = (user) => ({
  type: types.CREATE_USER_SUCCESS,
  payload: user
});

export const createUserFailure = (error) => ({
  type: types.CREATE_USER_FAILURE,
  payload: error
});

// Update user
export const updateUserRequest = (userId, userData) => ({
  type: types.UPDATE_USER_REQUEST,
  payload: { userId, userData }
});

export const updateUserSuccess = (user) => ({
  type: types.UPDATE_USER_SUCCESS,
  payload: user
});

export const updateUserFailure = (error) => ({
  type: types.UPDATE_USER_FAILURE,
  payload: error
});

// Delete user
export const deleteUserRequest = (userId) => ({
  type: types.DELETE_USER_REQUEST,
  payload: userId
});

export const deleteUserSuccess = (userId) => ({
  type: types.DELETE_USER_SUCCESS,
  payload: userId
});

export const deleteUserFailure = (error) => ({
  type: types.DELETE_USER_FAILURE,
  payload: error
});