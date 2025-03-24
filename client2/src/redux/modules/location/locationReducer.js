import * as types from './types';

const initialState = {
  locations: [],
  currentLocation: null,
  loading: false,
  error: null
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_LOCATIONS_REQUEST:
    case types.FETCH_LOCATION_REQUEST:
    case types.CREATE_LOCATION_REQUEST:
    case types.UPDATE_LOCATION_REQUEST:
    case types.DELETE_LOCATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.FETCH_LOCATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        locations: action.payload
      };

    case types.FETCH_LOCATION_SUCCESS:
      return {
        ...state,
        loading: false,
        currentLocation: action.payload
      };

    case types.CREATE_LOCATION_SUCCESS:
      return {
        ...state,
        loading: false,
        locations: [...state.locations, action.payload]
      };

    case types.UPDATE_LOCATION_SUCCESS:
      return {
        ...state,
        loading: false,
        locations: state.locations.map(location => 
          location._id === action.payload._id ? action.payload : location
        ),
        currentLocation: state.currentLocation && state.currentLocation._id === action.payload._id 
          ? action.payload 
          : state.currentLocation
      };

    case types.DELETE_LOCATION_SUCCESS:
      return {
        ...state,
        loading: false,
        locations: state.locations.filter(location => location._id !== action.payload),
        currentLocation: state.currentLocation && state.currentLocation._id === action.payload 
          ? null 
          : state.currentLocation
      };

    case types.FETCH_LOCATIONS_FAILURE:
    case types.FETCH_LOCATION_FAILURE:
    case types.CREATE_LOCATION_FAILURE:
    case types.UPDATE_LOCATION_FAILURE:
    case types.DELETE_LOCATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default locationReducer;