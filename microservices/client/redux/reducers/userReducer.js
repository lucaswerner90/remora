
import { FETCH_USER_PREFERENCES, UPDATE_USER_PREFERENCES, UPDATE_USER_FAVORITE_COINS, UPDATE_USER_SELECTED_COIN, UPDATE_USER_NOTIFICATIONS, GET_USER_SELECTED_COIN } from '../actions/types';

const initialState = {
  userPreferences: {
    selectedCoin: 'binance_ETHUSDT',
    favorites: ['binance_ETHUSDT', 'binance_BTCUSDT'],
    notifications:[]
  },
  userInfo: {},
};

export default (state = initialState, { payload = {}, type = ''}) => {
  switch (type) {
    case GET_USER_SELECTED_COIN:
      return state;
    case UPDATE_USER_SELECTED_COIN:
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          selectedCoin: payload
        }
      };
    
    case UPDATE_USER_FAVORITE_COINS:
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          favorites: payload
        }
      };
    
    case UPDATE_USER_NOTIFICATIONS:
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          notifications: payload
        }
      };
    
    case FETCH_USER_PREFERENCES:
      return state.userPreferences;

    case UPDATE_USER_PREFERENCES:
      return {
        ...state,
        userPreferences: payload
      };
    default:
      return state;
  }
}