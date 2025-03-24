import * as types from './types';

// Fetch all locations
export const fetchLocationsRequest = () => ({
  type: types.FETCH_LOCATIONS_REQUEST
});

export const fetchLocationsSuccess = (locations) => ({
  type: types.FETCH_LOCATIONS_SUCCESS,
  payload: locations
});

export const fetchLocationsFailure = (error) => ({
  type: types.FETCH_LOCATIONS_FAILURE,
  payload: error
});

// Fetch single location
export const fetchLocationRequest = (locationId) => ({
  type: types.FETCH_LOCATION_REQUEST,
  payload: locationId
});

export const fetchLocationSuccess = (location) => ({
  type: types.FETCH_LOCATION_SUCCESS,
  payload: location
});

export const fetchLocationFailure = (error) => ({
  type: types.FETCH_LOCATION_FAILURE,
  payload: error
});

// Create location
export const createLocationRequest = (locationData) => ({
  type: types.CREATE_LOCATION_REQUEST,
  payload: locationData
});

export const createLocationSuccess = (location) => ({
  type: types.CREATE_LOCATION_SUCCESS,
  payload: location
});

export const createLocationFailure = (error) => ({
  type: types.CREATE_LOCATION_FAILURE,
  payload: error
});

// Update location
export const updateLocationRequest = (locationId, locationData) => ({
  type: types.UPDATE_LOCATION_REQUEST,
  payload: { locationId, locationData }
});

export const updateLocationSuccess = (location) => ({
  type: types.UPDATE_LOCATION_SUCCESS,
  payload: location
});

export const updateLocationFailure = (error) => ({
  type: types.UPDATE_LOCATION_FAILURE,
  payload: error
});

// Delete location
export const deleteLocationRequest = (locationId) => ({
  type: types.DELETE_LOCATION_REQUEST,
  payload: locationId
});

export const deleteLocationSuccess = (locationId) => ({
  type: types.DELETE_LOCATION_SUCCESS,
  payload: locationId
});

export const deleteLocationFailure = (error) => ({
  type: types.DELETE_LOCATION_FAILURE,
  payload: error
});