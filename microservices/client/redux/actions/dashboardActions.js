import { UPDATE_CHART_TIMELINE, UPDATE_PRICES_LIST } from './types';
import store from '../store';

export const updateChartTimeline = (payload) => dispatch => {
  store.dispatch({
    payload: [],
    type: UPDATE_PRICES_LIST
  });
  dispatch({
    payload,
    type: UPDATE_CHART_TIMELINE,
  });
};