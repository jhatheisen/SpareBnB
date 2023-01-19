import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import mapsReducer from './maps';
import sessionReducer from './session';
import spotsReducer from './spots';
import bookingsReducer from './bookings';

const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer,
  maps: mapsReducer,
  bookings: bookingsReducer
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOlS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
}

export default configureStore;
