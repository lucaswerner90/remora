import io from 'socket.io-client';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { api } = publicRuntimeConfig;

import store from '../../../redux/store';
import { UPDATE_PRICES_LIST, UPDATE_VOLUME_DIFFERENCE, UPDATE_PRICE, UPDATE_PRICE_CHANGE, UPDATE_ORDER, UPDATE_PREVIOUS_ORDER, UPDATE_COUNT_ORDER } from '../../../redux/actions/types';
import { timelineChartValues } from '../constants';


const channelList = [
  'price_list_1min',
  'price_list_5min',
  'price_list_15min',
  'volume_difference',
  'order',
  'count_orders',
  'previous_order',
  'price_change_24hr',
  'latest_price',
];

class CoinSocket{
  constructor() {
    this.socket = io(api, { forceNew: true });
  }
  closeCoinConnections(coinID = '') {
    if (coinID) {
      for (let i = 0; i < channelList.length; i++) {
        const channel = channelList[i];
        this.socket.off(`${coinID}_${channel}`);
      }
      this.socket.removeAllListeners();
    }
  }
  openCoinConnections(coinID = '') {
    for (let i = 0; i < channelList.length; i++) {
      const channel = channelList[i];
      this.socket.on(`${coinID}_${channel}`, this.onSocketData);
    }
  }
  onSocketData({ info = {}, message = '' }) {
    const timeline = store.getState().dashboard.chartTimeline;
    switch (message) {
      case 'price_list_1min':
        if (timeline === timelineChartValues.MINUTE) {
            store.dispatch({
              payload: info.pricesList,
              type: UPDATE_PRICES_LIST,
            });
        }
        break;
      case 'price_list_5min':
        if (timeline === timelineChartValues.FIVE) {
          store.dispatch({
            payload: info.pricesList,
            type: UPDATE_PRICES_LIST,
          });
        }
        break;
      case 'price_list_15min':
        if (timeline === timelineChartValues.FIFTEEN) {
          store.dispatch({
            payload: info.pricesList,
            type: UPDATE_PRICES_LIST,
          });
        }
        break;
      case 'volume_difference':
        store.dispatch({
          payload: info.volumeDifference,
          type: UPDATE_VOLUME_DIFFERENCE,
        });
        break;
      case 'count_orders':
        // console.log(info);
        // store.dispatch({
        //   payload: info,
        //   type: UPDATE_COUNT_ORDER,
        // });
        break;
      case 'order':
        store.dispatch({
          payload: info,
          type: UPDATE_ORDER,
        });
        break;
      case 'previous_order':
        info.order.hasDissapeared = true;
        store.dispatch({
          payload: info,
          type: UPDATE_PREVIOUS_ORDER,
        });
        break;

      case 'price_change_24hr':
        store.dispatch({
          payload: info.price,
          type: UPDATE_PRICE_CHANGE,
        });
        break;

      case 'latest_price':
        store.dispatch({
          payload: info.price,
          type: UPDATE_PRICE,
        });
        break;
      default:
        break;
    }
  }

}

const coinSocket = new CoinSocket();
export default coinSocket;