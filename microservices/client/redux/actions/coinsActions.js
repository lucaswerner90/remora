import { UPDATE_SELECTED_COIN } from './types';

export const getCoinByID = (coinID = '') => dispatch => {
  if (coinID.length) {
    dispatch({
      type: UPDATE_SELECTED_COIN,
      payload: coinID
    });
  }
};