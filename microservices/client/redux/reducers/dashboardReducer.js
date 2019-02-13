
import { UPDATE_CHART_TIMELINE } from '../actions/types';
import {timelineChartValues} from '../../components/common/constants';
const initialState = {
  chartTimeline: timelineChartValues.FIFTEEN
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CHART_TIMELINE:
      return { ...state, chartTimeline: action.payload };
    default:
      return state;
  }
}