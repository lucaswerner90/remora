
import { UPDATE_PRICES_LIST, UPDATE_VOLUME_DIFFERENCE, UPDATE_PRICE, UPDATE_PRICE_CHANGE, UPDATE_PREVIOUS_ORDER, UPDATE_ORDER, UPDATE_LOADING_INFO } from '../actions/types';

const initialState = {
  volumeDifference: 0,
  pricesList: [],
  price: 0,
  previousBuyOrder: {},
  previousSellOrder: {},
  buyOrder: {},
  sellOrder: {},
  priceChange: 0,
  loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOADING_INFO:
      return {...state, loading: action.payload};
    case UPDATE_PRICES_LIST:
      return {...state, pricesList: action.payload};
    case UPDATE_VOLUME_DIFFERENCE:
      return { ...state, volumeDifference: action.payload};
    case UPDATE_PRICE:
      return { ...state, price: action.payload};
    case UPDATE_PRICE_CHANGE:
      return { ...state, priceChange: action.payload};
    case UPDATE_ORDER:
      if (action.payload.type === 'buy') {
        return { ...state, buyOrder : action.payload.order };
      }
      return { ...state, sellOrder: action.payload.order};
    case UPDATE_PREVIOUS_ORDER:
      if (action.payload.type === 'buy') {
        return { ...state, previousBuyOrder: action.payload.order };
      }
      return { ...state, previousSellOrder: action.payload.order };
    case UPDATE_PRICE_CHANGE:
      return { ...state, priceChange: action.payload};
    default:
      return state;
  }
}