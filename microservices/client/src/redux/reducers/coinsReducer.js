
import { UPDATE_ALL_COINS, UPDATE_SELECTED_TWEETS, APPEND_SELECTED_TWEETS } from '../actions/types';

const initialState = {
  all: {
  },
  tweets:[]
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ALL_COINS:
      return { ...state, all: action.payload };
    default:
      return state;
  }
}