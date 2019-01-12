import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';

export class CoinStatus extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { value = 0 } = this.props;
    return (
      <Grid container style={{ flexGrow: 1 }} spacing={0}>
        <Grid item xs={12}>
          <Typography style={{ color: 'grey', fontSize: '0.625rem' }} align="center" variant="body2">
            Status
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ color: 'grey', fontSize: '0.625rem' }} align="center" variant="body1">
            {value}
          </Typography>
        </Grid>
      </Grid>

    );
  }
}

export default CoinStatus;
