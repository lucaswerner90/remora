
import { UPDATE_ALL_COINS, UPDATE_SPECIFIC_COIN_PRICE_CHANGE, UPDATE_SPECIFIC_COIN_PRICE } from '../actions/types';

const initialState = {
  all: {
  }
};

export default (state = initialState, action) => {
  let coin = '';
  switch (action.type) {
    case UPDATE_ALL_COINS:
      return { ...state, all: action.payload };
    case UPDATE_SPECIFIC_COIN_PRICE_CHANGE:
      coin = action.payload.coin;
      const { priceChange } = action.payload;
      return {
        ...state,
        priceChange:{
          ...state.priceChange,
          [coin]: priceChange
        }
      };
    case UPDATE_SPECIFIC_COIN_PRICE:
      coin = action.payload.coin;
      const { price } = action.payload;
      return {
        ...state,
        prices: {
          ...state.prices,
          [coin]: price
        }
      };
    default:
      return state;
  }
}