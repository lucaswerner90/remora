
import { FETCH_EXCHANGES_COINS, UPDATE_SELECTED_COIN } from '../actions/types';

const initialState = {
  exchanges: {
    binance: {
      name: 'Binance',
      url: 'https://binance.com',
      coins: {
        'binance_ETHUSDT': {
          id: 'binance_ETHUSDT',
          name: 'Ethereum',
          symbol: 'ETH',
          exchange: 'Binance',
        },
        'binance_BTCUSDT': {
          id: 'binance_BTCUSDT',
          name: 'Bitcoin',
          symbol: 'BTC',
          exchange: 'Binance',
        },
        'binance_TRXUSDT': {
          id: 'binance_TRXUSDT',
          name: 'Tron',
          symbol: 'TRX',
          exchange: 'Binance',
        },
        'binance_XRPUSDT': {
          id: 'binance_XRPUSDT',
          name: 'Ripple',
          symbol: 'XRP',
          exchange: 'Binance',
        },
      }
    }
  },
  selected: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_COIN:
      const coinID = action.payload;
      const exchanges = Object.values(state.exchanges);
      for (let i = 0; i < exchanges.length; i++) {
        const { coins = [] } = exchanges[i];
        if (coins[coinID]) return { ...state, selected: coins[coinID] };
      }
    case FETCH_EXCHANGES_COINS:
      return { ...state };
    default:
      return state;
  }
}