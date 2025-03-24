import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './locationActions';

// Fetch all locations
function* fetchLocationsSaga() {
  try {
    const response = yield call(fetch, 'http://localhost:8080/api/location', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = yield response.json();
      throw new Error(errorData.message || 'Failed to fetch locations');
    }

    const data = yield response.json();
    yield put(actions.fetchLocationsSuccess(data));
  } catch (error) {
    yield put(actions.fetchLocationsFailure(error.message));
  }
}

// Fetch single location
function* fetchLocationSaga(action) {
  try {
    const locationId = action.payload;
    const response = yield call(fetch, `http://localhost:8080/api/location/${locationId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = yield response.json();
      throw new Error(errorData.message || 'Failed to fetch location');
    }

    const data = yield response.json();
    yield put(actions.fetchLocationSuccess(data));
  } catch (error) {
    yield put(actions.fetchLocationFailure(error.message));
  }
}

// Create location
function* createLocationSaga(action) {
  try {
    const response = yield call(fetch, 'http://localhost:8080/api/location', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    });

    if (!response.ok) {
      const errorData = yield response.json();
      throw new Error(errorData.message || 'Failed to create location');
    }

    const data = yield response.json();
    yield put(actions.createLocationSuccess(data));
  } catch (error) {
    yield put(actions.createLocationFailure(error.message));
  }
}

// Update location
function* updateLocationSaga(action) {
  try {
    const { locationId, locationData } = action.payload;
    const response = yield call(fetch, `http://localhost:8080/api/location/${locationId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationData)
    });

    if (!response.ok) {
      const errorData = yield response.json();
      throw new Error(errorData.message || 'Failed to update location');
    }

    const data = yield response.json();
    yield put(actions.updateLocationSuccess(data));
  } catch (error) {
    yield put(actions.updateLocationFailure(error.message));
  }
}

// Delete location
function* deleteLocationSaga(action) {
  try {
    const locationId = action.payload;
    const response = yield call(fetch, `http://localhost:8080/api/location/${locationId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = yield response.json();
      throw new Error(errorData.message || 'Failed to delete location');
    }

    yield put(actions.deleteLocationSuccess(locationId));
  } catch (error) {
    yield put(actions.deleteLocationFailure(error.message));
  }
}

export default function* watchLocationSaga() {
  yield takeLatest(types.FETCH_LOCATIONS_REQUEST, fetchLocationsSaga);
  yield takeLatest(types.FETCH_LOCATION_REQUEST, fetchLocationSaga);
  yield takeLatest(types.CREATE_LOCATION_REQUEST, createLocationSaga);
  yield takeLatest(types.UPDATE_LOCATION_REQUEST, updateLocationSaga);
  yield takeLatest(types.DELETE_LOCATION_REQUEST, deleteLocationSaga);
}