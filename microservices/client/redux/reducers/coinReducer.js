
import { SELECT_COIN_DETAIL, GET_ALL_FAVORITES } from '../actions/types';

const initialState = {
  selected: {},
  favorites: [
    {
      id: 'ETHUSDT',
      name: 'Ethereum',
      against: '$',
      isFavorite: true,
      coinSymbol: 'ETH',
      url: 'https://binance.com/en/trade/pro/ETH_USDT',
      exchange: 'binance'
    },
    {
      id: 'BTCUSDT',
      name: 'Bitcoin',
      isFavorite: true,
      against: '$',
      coinSymbol: 'BTC',
      url: 'https://binance.com/en/trade/pro/BTC_USDT',
      exchange: 'binance'
    },
  ],
};


export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_COIN_DETAIL:
      return {
        ...state,
        selected: action.payload
      };
    case GET_ALL_FAVORITES:
      return state.favorites;
      break;
    default:
      return state;
  }
}