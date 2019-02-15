import io from 'socket.io-client';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { api } = publicRuntimeConfig;

import store from '../../../redux/store';
import { UPDATE_SELECTED_PRICES_LIST, UPDATE_SELECTED_VOLUME_DIFFERENCE, UPDATE_SELECTED_PRICE, UPDATE_SELECTED_PRICE_CHANGE, UPDATE_SELECTED_ORDER, UPDATE_SELECTED_PREVIOUS_ORDER } from '../../../redux/actions/types';
import { timelineChartValues } from '../constants';

const commonChannels = [
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
  getTimelineChannelValue(timeline){
    if (timeline === timelineChartValues.MINUTE) {
      return 'price_list_1min';
    } else if (timeline === timelineChartValues.FIVE) {
      return 'price_list_5min';
    } else if (timeline === timelineChartValues.FIFTEEN) {
      return 'price_list_15min';
    } else if (timeline === timelineChartValues.HOUR) {
      return 'price_list_1hour';
    } else if (timeline === timelineChartValues.TWOHOURS) {
      return 'price_list_2hour';
    }
  }

  closeCoinConnections(coinID = '') {
    if (coinID) {
      const timeline = store.getState().dashboard.chartTimeline;
      for (let i = 0; i < commonChannels.length; i++) {
        const channel = commonChannels[i];
        this.socket.off(`${coinID}_${channel}`);
      }
      const priceChannel = this.getTimelineChannelValue(timeline);
      this.socket.off(`${coinID}_${priceChannel}`);

      this.socket.removeAllListeners();
    }
  }
  openCoinConnections(coinID = '') {
    for (let i = 0; i < commonChannels.length; i++) {
      const channel = commonChannels[i];
      this.socket.on(`${coinID}_${channel}`, this.onSocketData);
    }
    const timeline = store.getState().dashboard.chartTimeline;
    const priceChannel = this.getTimelineChannelValue(timeline);
    this.socket.on(`${coinID}_${priceChannel}`, this.onPricesSocketData);
  }

  openSpecificConnection(coinID, channel, callback) {
    this.socket.on(`${coinID}_${channel}`, callback);
  }

  closeSpecificConnection(coinID, channel) {
    this.socket.off(`${coinID}_${channel}`);
  }

  onPricesSocketData({ info = {} }) {
    store.dispatch({
      payload: info.pricesList,
      type: UPDATE_SELECTED_PRICES_LIST,
    });
  }

  onSocketData({ info = {}, message = '' }) {
    switch (message) {
      case 'volume_difference':
        store.dispatch({
          payload: info.volumeDifference,
          type: UPDATE_SELECTED_VOLUME_DIFFERENCE,
        });
        break;
      case 'count_orders':
        // console.log(info);
        // store.dispatch({
        //   payload: info,
        //   type: UPDATE_SELECTED_COUNT_ORDER,
        // });
        break;
      case 'order':
        store.dispatch({
          payload: info,
          type: UPDATE_SELECTED_ORDER,
        });
        break;
      case 'previous_order':
        info.order.hasDissapeared = true;
        store.dispatch({
          payload: info,
          type: UPDATE_SELECTED_PREVIOUS_ORDER,
        });
        break;

      case 'price_change_24hr':
        store.dispatch({
          payload: info.price,
          type: UPDATE_SELECTED_PRICE_CHANGE,
        });
        break;

      case 'latest_price':
        store.dispatch({
          payload: info.price,
          type: UPDATE_SELECTED_PRICE,
        });
        break;
      default:
        break;
    }
  }

}

const coinSocket = new CoinSocket();
export default coinSocket;