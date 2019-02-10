import React, { Component } from 'react';
import { Grid, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

import { connect } from 'react-redux';
import { updateChartTimeline } from '../../../../redux/actions/dashboardActions';

import { timelineChartValues } from '../../../common/constants';

const mapReduxStateToComponentProps = state => ({
  selected: state.dashboard.chartTimeline
});
class ChartTimelineSelector extends Component {
  handleChange = (e) => {
    this.props.updateChartTimeline(e.target.value);
  }
  render() {
    const { selected } = this.props;
    return (
      <Grid container justify="center" style={{flexGrow:1}} alignItems="center">
        <Grid item xs={12} sm={12} md={12}>
          <RadioGroup
            aria-label="position"
            name="position"
            value={selected}
            style={{justifyContent:'center'}}
            onChange={this.handleChange}
            row
          >
          <FormControlLabel
            value={timelineChartValues.MINUTE}
            control={<Radio color="primary" />}
            label="1min"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value={timelineChartValues.FIVE}
            control={<Radio color="primary" />}
            label="5min"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value={timelineChartValues.FIFTEEN}
            control={<Radio color="primary" />}
            label="15min"
            labelPlacement="bottom"
            />
          </RadioGroup>
        </Grid>
      </Grid>
    )
  }
}

export default connect(mapReduxStateToComponentProps, { updateChartTimeline })(ChartTimelineSelector);