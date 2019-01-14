import { SELECT_COIN_DETAIL, GET_ALL_FAVORITES, UPDATE_COIN_INFO } from './types';

export const getFavorites = () => dispatch => {
  return dispatch({
    type: GET_ALL_FAVORITES,
    payload: undefined
  });
}
export const updateCoinInfo = (coin) => dispatch => {
  return dispatch({
    type: UPDATE_COIN_INFO,
    payload: coin
  });
}

export const selectCoin = (coin) => dispatch => {
  return dispatch({
    type: SELECT_COIN_DETAIL,
    payload: coin
  });

};