import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { timelineChartValues } from '../components/common/constants';

const initialState = {
  dashboard: {
    chartTimeline: timelineChartValues.FIFTEEN
  }
};
const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware)
  )
);
export default store;