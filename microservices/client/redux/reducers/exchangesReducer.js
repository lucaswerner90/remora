
import { FETCH_EXCHANGES_COINS } from '../actions/types';

const initialState = {
  binance: {
    name: 'Binance',
    against: '$',
    url: 'https://binance.com',
    coins: [
      {
        id: 'binance_ETHUSDT',
        coinSymbol: 'ETH',
        name: 'Ethereum',
        against: '$',
        url: 'https://binance.com/en/trade/pro/ETH_USDT',
        exchange: 'binance'
      },
      {
        id: 'binance_LTCUSDT',
        name: 'Litecoin',
        against: '$',
        coinSymbol: 'LTC',
        url: 'https://binance.com/en/trade/pro/LTC_USDT',
        exchange: 'binance'
      },
      {
        id: 'binance_BTCUSDT',
        name: 'Bitcoin',
        against: '$',
        coinSymbol: 'BTC',
        url: 'https://binance.com/en/trade/pro/BTC_USDT',
        exchange: 'binance'
      },
      {
        id: 'binance_XRPUSDT',
        name: 'Ripple',
        against: '$',
        coinSymbol: 'XRP',
        url: 'https://binance.com/en/trade/pro/XRP_USDT',
        exchange: 'binance'
      },
    ]
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EXCHANGES_COINS:
      return { ...state };
    default:
      return state;
  }
}