
import { UPDATE_USER_PREFERENCES, UPDATE_USER_FAVORITE_COINS, UPDATE_USER_SELECTED_COIN, UPDATE_USER_NOTIFICATIONS, UPDATE_USER_INFO } from '../actions/types';

const initialState = {
  userPreferences: {
    selectedCoin: '',
    favorites: [],
    notifications: {}
  },
  userInfo: {
    
  },
};

export default (state = initialState, { payload = {}, type = ''}) => {
  switch (type) {
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
    
    case UPDATE_USER_PREFERENCES:
      return {
        ...state,
        userPreferences: payload
      };
    case UPDATE_USER_INFO:
      return {
        ...state,
        userInfo: payload
      };
    default:
      return state;
  }
}