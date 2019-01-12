
import { FETCH_USER_PREFERENCES, UPDATE_USER_PREFERENCES } from '../actions/types';

const initialState = {
  userPreferences: {},
  userInfo: {},
  newUserPreferences: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_PREFERENCES:
      return {
        ...state,
        userPreferences: action.payload
      };
    case UPDATE_USER_PREFERENCES:
      return {
        ...state,
        newUserPreferences: action.payload
      };
    default:
      return state;
  }
}