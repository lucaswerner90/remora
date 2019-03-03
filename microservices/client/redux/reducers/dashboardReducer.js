
import { UPDATE_CHART_TIMELINE, HOVER_NOTIFICATION } from '../actions/types';
import {timelineChartValues} from '../../components/common/constants';
const initialState = {
  chartTimeline: timelineChartValues.FIFTEEN,
  hoverNotification: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CHART_TIMELINE:
      return { ...state, chartTimeline: action.payload };
    case HOVER_NOTIFICATION:
      return { ...state, hoverNotification: action.payload };
    default:
      return state;
  }
}