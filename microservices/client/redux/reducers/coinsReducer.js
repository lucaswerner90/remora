
import { UPDATE_ALL_COINS } from '../actions/types';

const initialState = {
  all: {
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ALL_COINS:
      return { ...state, all: action.payload };
    default:
      return state;
  }
}