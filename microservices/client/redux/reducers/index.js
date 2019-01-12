import { combineReducers } from 'redux';
import userReducer from './userReducer';
import exchangesReducer from './exchangesReducer';

export default combineReducers({
  user: userReducer,
  exchange: exchangesReducer
});
