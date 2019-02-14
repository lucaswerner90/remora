import { UPDATE_ALL_COINS, UPDATE_SPECIFIC_COIN_PRICE, UPDATE_SPECIFIC_COIN_PRICE_CHANGE } from './types';
import coinSocket from '../../components/common/socket/CoinSocket';

const registerAllCoinsSockets = (coins = {}, dispatch) => {
  const coinsID = Object.keys(coins);
  for (let i = 0; i < coinsID.length; i++) {
    const coin = coinsID[i];
    coinSocket.openSpecificConnection(coin, 'price_change_24hr', ({ info }) => {
      const priceChange = parseFloat(info.price);
      const payload = { coin, priceChange };
      dispatch({
        payload,
        type: UPDATE_SPECIFIC_COIN_PRICE_CHANGE,
      });
    });
    coinSocket.openSpecificConnection(coin, 'latest_price', ({ info }) => {
      const { price } = info;
      const payload = { coin, price };
      dispatch({
        payload,
        type: UPDATE_SPECIFIC_COIN_PRICE,
      });
    });
    
  }
}

export const updateAllCoins = (payload) => dispatch => {
  // Register all the events for the coins list
  // registerAllCoinsSockets(payload, dispatch);
  dispatch({
    payload,
    type: UPDATE_ALL_COINS,
  });
};