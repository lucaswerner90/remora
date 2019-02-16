import store from '../../../redux/store';
import { timelineChartValues } from '../constants';
import { UPDATE_SELECTED_PRICES_LIST, UPDATE_SELECTED_VOLUME_DIFFERENCE, UPDATE_SELECTED_PRICE, UPDATE_SELECTED_PRICE_CHANGE, UPDATE_SELECTED_PREVIOUS_ORDER } from '../../../redux/actions/types';


import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { api } = publicRuntimeConfig;



export const getLastTweets = async(coinName) => {
  if (coinName) {
    const userRequestData = {
      method: 'POST',
      body: JSON.stringify({ coinName }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`${api}/api/coin/tweets`, userRequestData);
    const { value = {} } = await response.json();
    return value;
  } else {
    return {};
  }
}
export const getLastNews = async(coinName) => {
  if (coinName) {
    const userRequestData = {
      method: 'POST',
      body: JSON.stringify({ coinName }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`${api}/api/coin/news`, userRequestData);
    const { value = {} } = await response.json();
    return value;
  } else {
    return {};
  }
}
const getCoinProperty = async (coinID, property) => {
  if (coinID) {
    const userRequestData = {
      method: 'POST',
      body: JSON.stringify({ property, coinID }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`${api}/api/coin/property`, userRequestData);
    const { value = {} } = await response.json();
    return value;
  } else {
    return {};
  }
}

const getCoinPricesList = async (coinID) => {
  const timeline = store.getState().dashboard.chartTimeline;
  let value = [];
  if (timeline === timelineChartValues.MINUTE || timeline === timelineChartValues.REALTIME) {
    value = await getCoinProperty(coinID, 'price_list_1min');
  } else if (timeline === timelineChartValues.FIVE) {
    value = await getCoinProperty(coinID, 'price_list_5min');
  } else {
    value = await getCoinProperty(coinID, 'price_list_15min');
  }
  store.dispatch({
    payload: value.prices,
    type: UPDATE_SELECTED_PRICES_LIST,
  });
}
const getCoinPrice = async (coinID) => {
  const value = await getCoinProperty(coinID, 'price');
  const price = value && value.price ? value.price : 0;
  store.dispatch({
    payload: price,
    type: UPDATE_SELECTED_PRICE,
  });
}
const getVolumeDifference = async (coinID) => {
  const value = await getCoinProperty(coinID, 'volume_difference');
  const volumeDifference = value && value.volumeDifference ? value.volumeDifference : 0;
  store.dispatch({
    payload: volumeDifference,
    type: UPDATE_SELECTED_VOLUME_DIFFERENCE,
  });
}
const getPriceChange = async (coinID) => {
  const value = await getCoinProperty(coinID, 'price_change_24hr');
  const priceChange = value && value.price ? value.priceChange : 0;
  store.dispatch({
    payload: priceChange,
    type: UPDATE_SELECTED_PRICE_CHANGE,
  });
}
const getPreviousOrders = async (coinID) => {
  const [previousBuyOrder, previousSellOrder] = await Promise.all([
    getCoinProperty(coinID, 'buy_order_previous'),
    getCoinProperty(coinID, 'sell_order_previous')]
  );
  if (previousBuyOrder && previousBuyOrder.order) {
    previousBuyOrder.order.hasDissapeared = true;
    store.dispatch({
      payload: previousBuyOrder,
      type: UPDATE_SELECTED_PREVIOUS_ORDER,
    });
  }
  if (previousSellOrder && previousSellOrder.order) {
    previousSellOrder.order.hasDissapeared = true;
    store.dispatch({
      payload: previousSellOrder,
      type: UPDATE_SELECTED_PREVIOUS_ORDER,
    });
  }

}

export const getAllProperties = async (coinID) => {
  try {
    await Promise.all([
      getPreviousOrders(coinID),
      getCoinPricesList(coinID),
      getCoinPrice(coinID),
      getVolumeDifference(coinID),
      getPriceChange(coinID),
    ]);
  } catch (error) {
    throw error;
  } finally {
  }
  
}