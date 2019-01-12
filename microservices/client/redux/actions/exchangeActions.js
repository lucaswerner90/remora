import fetch from 'isomorphic-unfetch';

import { FETCH_EXCHANGES_COINS } from './types';


export const fetchExchangesInfo = () => async dispatch => {
  const res = await new Promise((resolve) => {
    dispatch({
      type: FETCH_EXCHANGES_COINS,
      payload: res
    });
    resolve('someinfo about the exchanges goes here...');
  });
  // const exchangesInfo = await res.json();
  
};