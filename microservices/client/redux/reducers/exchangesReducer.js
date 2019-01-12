
import { FETCH_EXCHANGES_COINS } from '../actions/types';

const initialState = {
  info: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EXCHANGES_COINS:
      return {
        ...state,
        info: action.payload
      };
    default:
      return state;
  }
}