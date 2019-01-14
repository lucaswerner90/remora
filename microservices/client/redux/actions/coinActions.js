import { SELECT_COIN_DETAIL, GET_ALL_FAVORITES } from './types';

export const getFavorites = () => dispatch => {
  console.log('getFavorites()')
  return dispatch({
    type: GET_ALL_FAVORITES,
    payload: undefined
  });
}
export const selectCoin = (coin) => dispatch => {
  return dispatch({
    type: SELECT_COIN_DETAIL,
    payload: coin
  });

};