import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGOUT,
    VERIFY_TOKEN,
    VERIFY_TOKEN_FAILURE,
    VERIFY_TOKEN_SUCCESS
  } from "./types";
  
  const initialState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  };
  
  const authReducer = (state = initialState, action) => {
      switch (action.type) {
        case LOGIN_REQUEST:
        case REGISTER_REQUEST:
          return {
            ...state,
            loading: true,
            error: null,
          };
        case VERIFY_TOKEN:
          return {
            ...state,
            loading: true,
          };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
        case VERIFY_TOKEN_SUCCESS:
          return {
            ...state,
            loading: false,
            user: action.payload,
            error: null,
            isAuthenticated: true,
            isInitialized: true
          };
        case LOGIN_FAILURE:
        case REGISTER_FAILURE:
          return {
            ...state,
            loading: false,
            error: action.payload,
            isAuthenticated: false,
            isInitialized: true
          };
        case VERIFY_TOKEN_FAILURE:
          return {
            ...state,
            loading: false,
            isAuthenticated: false,
            isInitialized: true
          };
        case LOGOUT:
          return {
            ...initialState,
            isInitialized: true
          };
        default:
          return state;
      }
    };
  
  export default authReducer;