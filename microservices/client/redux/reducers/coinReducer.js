
import { SELECT_COIN_DETAIL, GET_ALL_FAVORITES, UPDATE_COIN_INFO } from '../actions/types';

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
  'binance': {
    'ETHUSDT': {
      'price':0
    }
  }
};


export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SELECT_COIN_DETAIL:
      return {
        ...state,
        selected: payload
      };
    case UPDATE_COIN_INFO:
      console.log(payload);
      // return {
      //   ...state,
      //   info: {
      //     ...state.info,
      //     [payload.exchange]: {
      //       ...state.info[payload.exchange],
      //       [payload.id]: {
      //         ...state.info[payload.exchange][payload.id],
      //         ...payload
      //       }
      //     }
      //   }
      // };
    case GET_ALL_FAVORITES:
      return {...state};
    default:
      return state;
  }
}