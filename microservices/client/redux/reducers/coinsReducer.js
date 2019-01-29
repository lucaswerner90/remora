
import { GET_ALL_COINS, UPDATE_SELECTED_COIN } from '../actions/types';

const initialState = {
  coins: {
    'binance_ETHUSDT': {
      id: 'binance_ETHUSDT',
      name: 'Ethereum',
      symbol: 'ETH',
      exchange: 'Binance',
      against: 'USDT'
    },
    'binance_BTCUSDT': {
      id: 'binance_BTCUSDT',
      name: 'Bitcoin',
      symbol: 'BTC',
      exchange: 'Binance',
      against: 'USDT'
    },
    'binance_TRXUSDT': {
      id: 'binance_TRXUSDT',
      name: 'Tron',
      symbol: 'TRX',
      exchange: 'Binance',
      against: 'USDT'
    },
    'binance_XRPUSDT': {
      id: 'binance_XRPUSDT',
      name: 'Ripple',
      symbol: 'XRP',
      exchange: 'Binance',
      against: 'USDT'
    },
    'binance_LTCUSDT': {
      id: 'binance_LTCUSDT',
      name: 'Litecoin',
      symbol: 'LTC',
      exchange: 'Binance',
      against: 'USDT'
    },
  },
  selected: 'binance_ETHUSDT'
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_COIN:
      const coinID = action.payload;
      return { ...state, selected: state.coins[coinID] };
    default:
      return state;
  }
}