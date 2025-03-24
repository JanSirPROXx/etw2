import * as types from './types';

const initialState = {
  users: [],
  loading: false,
  error: null
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_USERS_REQUEST:
    case types.CREATE_USER_REQUEST:
    case types.UPDATE_USER_REQUEST:
    case types.DELETE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: false
      };

    case types.CREATE_USER_SUCCESS:
      return {
        ...state,
        users: [...state.users, action.payload],
        loading: false
      };

    case types.UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.map(user => 
          user._id === action.payload._id ? action.payload : user
        ),
        loading: false
      };

    case types.DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload),
        loading: false
      };

    case types.FETCH_USERS_FAILURE:
    case types.CREATE_USER_FAILURE:
    case types.UPDATE_USER_FAILURE:
    case types.DELETE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    default:
      return state;
  }
};

export default adminReducer;