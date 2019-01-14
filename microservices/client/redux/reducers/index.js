import { combineReducers } from 'redux';
import userReducer from './userReducer';
import exchangesReducer from './exchangesReducer';
import coinReducer from './coinReducer';

export default combineReducers({
  user: userReducer,
  exchange: exchangesReducer,
  coin: coinReducer,
});
