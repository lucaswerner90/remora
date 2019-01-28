import { combineReducers } from 'redux';
import userReducer from './userReducer';
import coinsReducer from './coinsReducer';

export default combineReducers({
  user: userReducer,
  coins: coinsReducer,
});
