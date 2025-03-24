export const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

export const REGISTER_REQUEST = 'auth/REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'auth/REGISTER_FAILURE';

//Verify token
export const VERIFY_TOKEN = 'auth/VERIFY_TOKEN';
export const VERIFY_TOKEN_SUCCESS = 'auth/VERIFY_TOKEN_SUCCESS';
export const VERIFY_TOKEN_FAILURE = 'auth/VERIFY_TOKEN_FAILURE';

export const LOGOUT = 'auth/LOGOUT';

export const logout = () => ({
    type: LOGOUT,
});

export const loginRequest = (credentials) => ({
    type: LOGIN_REQUEST,
    payload: credentials,
});

export const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user,
});

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});

export const registerRequest = (userData) => ({
    type: REGISTER_REQUEST,
    payload: userData,
});

export const registerSuccess = (user) => ({
    type: REGISTER_SUCCESS,
    payload: user,
});

export const registerFailure = (error) => ({
    type: REGISTER_FAILURE,
    payload: error,
});

export const verifyToken = () => ({
    type: VERIFY_TOKEN
});

export const verifyTokenSuccess = (user) => ({
    type: VERIFY_TOKEN_SUCCESS,
    payload: user
});

export const verifyTokenFailure = () => ({
    type: VERIFY_TOKEN_FAILURE
});