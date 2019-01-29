import { UPDATE_SELECTED_COIN, GET_ALL_COINS } from './types';

export const getCoinByID = (coinID = '') => dispatch => {
  if (coinID.length) {
    dispatch({
      type: UPDATE_SELECTED_COIN,
      payload: coinID
    });
  }
};

export const getAllCoins = () => dispatch => {
  dispatch({
    type: GET_ALL_COINS,
  });
};