import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { loginUser, registerUser } from "../../../api/authAPI";
import { LOGIN_REQUEST, REGISTER_REQUEST, LOGOUT, VERIFY_TOKEN } from "./types";
import {
  loginRequest,
  loginFailure,
  loginSuccess,
  registerFailure,
  registerRequest,
  registerSuccess,
  logout,
  verifyToken,
  verifyTokenFailure,
  verifyTokenSuccess
} from "./authActions";

function* loginSaga(action) {
  try {
    // Use fetch directly instead of the API function with issues
    const response = yield call(fetch, "http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(action.payload),
    });

    const data = yield response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Success - dispatch success action with user data
    yield put(loginSuccess(data));
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

function* registerSaga(action) {
  try {
    const response = yield call(
      fetch,
      "http://localhost:8080/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(action.payload),
      }
    );

    const data = yield response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    yield put(registerSuccess(data));
  } catch (error) {
    yield put(registerFailure(error.message));
  }
}

function* logoutSaga() {
  try {
    yield call(fetch, "http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    // No need to dispatch anything here, the reducer will handle the LOGOUT action
  } catch (error) {
    console.error("Logout error:", error);
  }
}

function* verifyTokenSaga() {
  try {
    const response = yield call(fetch, 'http://localhost:8080/api/auth/verify', {
      method: 'GET',
      credentials: 'include', // Important for sending cookies
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Token invalid or expired');
    }
    
    const data = yield response.json();
    yield put(verifyTokenSuccess(data));
  } catch (error) {
    yield put(verifyTokenFailure());
  }
}

export default function* watchAuthSaga() {
  yield takeEvery(LOGIN_REQUEST, loginSaga);
  yield takeEvery(REGISTER_REQUEST, registerSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(VERIFY_TOKEN, verifyTokenSaga);
}