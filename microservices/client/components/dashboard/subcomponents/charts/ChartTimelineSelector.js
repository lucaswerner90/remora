import React, { Component } from 'react';
import { Grid, RadioGroup, FormControlLabel, Radio, Typography } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import { connect } from 'react-redux';
import { updateChartTimeline } from '../../../../redux/actions/dashboardActions';

import { timelineChartValues } from '../../../common/constants';
import coinSocket from '../../../common/socket/CoinSocket';

const mapReduxStateToComponentProps = state => ({
  selected: state.dashboard.chartTimeline,
  coin: state.user.userPreferences.selectedCoin
});
class ChartTimelineSelector extends Component {
  state = {
    value: 0,
  };
  getSelectedValue(value) {
    let equivalent = '';
    switch (value) {
      case timelineChartValues.TWOHOURS:
        equivalent = 0;
        break;
      case timelineChartValues.HOUR:
        equivalent = 1;
        break;
      case timelineChartValues.FIFTEEN:
        equivalent = 2;
        break;
      case timelineChartValues.FIVE:
        equivalent = 3;
        break;
      case timelineChartValues.MINUTE:
        equivalent = 4;
        break;
      default:
        break;
    }
    return equivalent;
  }
  handleChange = (e, value) => {
    let timeline = '';
    switch (value) {
      case 0:
        timeline = timelineChartValues.TWOHOURS;
        break;
      case 1:
        timeline = timelineChartValues.HOUR;
        break;
      case 2:
        timeline = timelineChartValues.FIFTEEN;
        break;
      case 3:
        timeline = timelineChartValues.FIVE;
        break;
      case 4:
        timeline = timelineChartValues.MINUTE;
        break;
      default:
        break;
    }
    // Change the channel where we receive the price data
    const { coin } = this.props;
    console.log(coin)
    coinSocket.closeSpecificConnection(coin, coinSocket.getTimelineChannelValue(this.props.selected));
    coinSocket.openSpecificConnection(coin, coinSocket.getTimelineChannelValue(timeline), coinSocket.onPricesSocketData);

    this.props.updateChartTimeline(timeline);
  }
  render() {
    const { selected } = this.props;
    const value = this.getSelectedValue(selected);
    return (
      <Grid container justify="center" style={{flexGrow:1, marginBottom:'10px'}} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="body2" align="center" style={{marginBottom:'10px'}}>
            {value === 0 && '2 hours'}
            {value === 1 && '1 hour'}
            {value === 2 && '15 min'}
            {value === 3 && '5 min'}
            {value === 4 && '1 min'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Slider
            value={value}
            min={0}
            max={4}
            step={1}
            onChange={this.handleChange}
            />
        </Grid>
      </Grid>
    )
  }
}

export default connect(mapReduxStateToComponentProps, { updateChartTimeline })(ChartTimelineSelector);