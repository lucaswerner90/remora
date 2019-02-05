import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';

const initialState = {};

const middleware = [];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware)
  )
);

export default store;