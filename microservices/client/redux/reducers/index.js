import { combineReducers } from 'redux';
import userReducer from './userReducer';
import coinsReducer from './coinsReducer';
import dashboardReducer from './dashboardReducer';
import liveReducer from './liveReducer';

export default combineReducers({
  user: userReducer,
  coins: coinsReducer,
  dashboard: dashboardReducer,
  live: liveReducer
});
