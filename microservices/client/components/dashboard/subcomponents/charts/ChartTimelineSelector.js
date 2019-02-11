import React, { Component } from 'react';
import { Grid, RadioGroup, FormControlLabel, Radio, Typography } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import { connect } from 'react-redux';
import { updateChartTimeline } from '../../../../redux/actions/dashboardActions';

import { timelineChartValues } from '../../../common/constants';

const mapReduxStateToComponentProps = state => ({
  selected: state.dashboard.chartTimeline
});
class ChartTimelineSelector extends Component {
  state = {
    value: 0,
  };

  handleChange = (e,value) => {
    const timeline = value === 2 ? timelineChartValues.MINUTE : value === 1 ? timelineChartValues.FIVE : timelineChartValues.FIFTEEN;
    this.props.updateChartTimeline(timeline);
  }
  render() {
    const { selected } = this.props;
    const value = selected === timelineChartValues.MINUTE ? 2 : selected === timelineChartValues.FIVE ? 1 : 0;
    return (
      <Grid container justify="center" style={{flexGrow:1, marginBottom:'10px'}} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="body2" align="center" style={{marginBottom:'10px'}}>
            {value === 0 && '15 min'}
            {value === 1 && '5 min'}
            {value === 2 && '1 min'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Slider
            value={value}
            min={0}
            max={2}
            step={1}
            onChange={this.handleChange}
            />
        </Grid>
      </Grid>
    )
  }
}

export default connect(mapReduxStateToComponentProps, { updateChartTimeline })(ChartTimelineSelector);