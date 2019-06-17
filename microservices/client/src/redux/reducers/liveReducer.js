
import { UPDATE_SELECTED_PRICES_LIST, UPDATE_SELECTED_VOLUME_DIFFERENCE, UPDATE_SELECTED_PRICE, UPDATE_SELECTED_PRICE_CHANGE, UPDATE_SELECTED_PREVIOUS_ORDER, UPDATE_SELECTED_ORDER, UPDATE_LOADING_INFO, UPDATE_SELECTED_COIN_MACD_DIFFERENCE, RESET_INFO } from '../actions/types';

const initialState = {
  volumeDifference: '...',
  pricesList: [],
  price: '...',
  previousBuyOrder: {},
  previousSellOrder: {},
  buyOrder: {},
  sellOrder: {},
  priceChange: '...',
  loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RESET_INFO:
      return { ...state, ...initialState };
    case UPDATE_LOADING_INFO:
      return {...state, loading: action.payload};
    case UPDATE_SELECTED_PRICES_LIST:
      return {...state, pricesList: action.payload};
    case UPDATE_SELECTED_VOLUME_DIFFERENCE:
      return { ...state, volumeDifference: action.payload};
    case UPDATE_SELECTED_PRICE:
      return { ...state, price: action.payload};
    case UPDATE_SELECTED_COIN_MACD_DIFFERENCE:
      return { ...state, macdDifference: action.payload};
    case UPDATE_SELECTED_PRICE_CHANGE:
      return { ...state, priceChange: action.payload};
    case UPDATE_SELECTED_ORDER:
      if (action.payload.type === 'buy') {
        return { ...state, buyOrder : action.payload.order };
      }
      return { ...state, sellOrder: action.payload.order};
    case UPDATE_SELECTED_PREVIOUS_ORDER:
      if (action.payload.type === 'buy') {
        return { ...state, previousBuyOrder: action.payload.order };
      }
      return { ...state, previousSellOrder: action.payload.order };
    case UPDATE_SELECTED_PRICE_CHANGE:
      return { ...state, priceChange: action.payload};
    default:
      return state;
  }
}