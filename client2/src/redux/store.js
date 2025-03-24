import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

//import reducers
import authReducer from './modules/auth/authReducer';
import adminReducer from './modules/admin/adminReducer';
import locationReducer from './modules/location/locationReducer';

//import sagass
import watchAuthSaga from './modules/auth/authSagas';
import watchAdminSaga from './modules/admin/adminSagas';
import watchLocationSaga from './modules/location/locationSagas';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  location: locationReducer,
});

// Set up Redux DevTools Extension
const composeEnhancers =
  (typeof window !== 'undefined' && 
   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || 
  compose;

// Root saga
function* rootSaga() {
  yield all([
    watchAuthSaga(),
    watchAdminSaga(),
    watchLocationSaga(),
  ]);
}

// Create store with DevTools
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

// Run saga
sagaMiddleware.run(rootSaga);

export default store;