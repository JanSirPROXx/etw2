import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './types';
import { 
  fetchUsersSuccess, 
  fetchUsersFailure,
  createUserSuccess,
  createUserFailure,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
  fetchUsersRequest
} from './adminActions';

// Fetch users saga
function* fetchUsersSaga() {
  try {
    const response = yield call(fetch, 'http://localhost:8080/api/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = yield response.json();
    yield put(fetchUsersSuccess(data));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
  }
}

// Create user saga
function* createUserSaga(action) {
  try {
    const response = yield call(fetch, 'http://localhost:8080/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(action.payload)
    });

    if (!response.ok) {
      const errorData = yield response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }

    const data = yield response.json();
    yield put(createUserSuccess(data));
  } catch (error) {
    yield put(createUserFailure(error.message));
  }
}

// Update user saga
function* updateUserSaga(action) {
  try {
    const { userId, userData } = action.payload;
    const response = yield call(fetch, `http://localhost:8080/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = yield response.json();
      throw new Error(errorData.message || 'Failed to update user');
    }

    const data = yield response.json();
    yield put(updateUserSuccess(data));
    
    // Refresh users list to ensure consistency
    yield put(fetchUsersRequest());
  } catch (error) {
    yield put(updateUserFailure(error.message));
  }
}

// Delete user saga
function* deleteUserSaga(action) {
  try {
    const userId = action.payload;
    const response = yield call(fetch, `http://localhost:8080/api/admin/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = yield response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }

    yield put(deleteUserSuccess(userId));
  } catch (error) {
    yield put(deleteUserFailure(error.message));
  }
}

export default function* watchAdminSaga() {
  yield takeLatest(types.FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeLatest(types.CREATE_USER_REQUEST, createUserSaga);
  yield takeLatest(types.UPDATE_USER_REQUEST, updateUserSaga);
  yield takeLatest(types.DELETE_USER_REQUEST, deleteUserSaga);
}