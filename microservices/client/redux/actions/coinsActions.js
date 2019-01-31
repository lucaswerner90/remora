import { UPDATE_SELECTED_COIN, UPDATE_ALL_COINS } from './types';

export const getCoinByID = (coinID = '') => dispatch => {
  if (coinID.length) {
    dispatch({
      type: UPDATE_SELECTED_COIN,
      payload: coinID
    });
  }
};

export const updateAllCoins = (payload) => dispatch => {
  dispatch({
    payload,
    type: UPDATE_ALL_COINS,
  });
};