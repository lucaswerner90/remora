import { UPDATE_CHART_TIMELINE, UPDATE_SELECTED_PRICES_LIST, HOVER_NOTIFICATION } from './types';
import store from '../store';
export const updateChartTimeline = (payload) => async(dispatch) => {
  store.dispatch({
    payload: [],
    type: UPDATE_SELECTED_PRICES_LIST
  });
  dispatch({
    payload,
    type: UPDATE_CHART_TIMELINE,
  });
};
export const hoverNotification = (payload) => dispatch => {
  dispatch({
    payload,
    type: HOVER_NOTIFICATION,
  });
};