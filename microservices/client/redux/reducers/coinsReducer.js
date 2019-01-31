
import { UPDATE_ALL_COINS } from '../actions/types';

const initialState = {
  coins: {
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ALL_COINS:
      return { ...state, coins: action.payload };
    default:
      return state;
  }
}