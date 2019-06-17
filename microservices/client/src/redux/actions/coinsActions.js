import { UPDATE_ALL_COINS } from './types';

export const updateAllCoins = (payload) => dispatch => {
  dispatch({
    payload,
    type: UPDATE_ALL_COINS,
  });
};