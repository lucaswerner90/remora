import React, { Component } from 'react'
import { Grid, Button } from '@material-ui/core';

export class CoinCardButtons extends Component {
  render() {
    const { coin } = this.props;
    return (
      <Grid container alignItems="flex-end">
        <Grid item xs={4}>
          <Button color="primary" size="small">See more</Button>
        </Grid>
      </Grid>
    );
  }
}

export default CoinCardButtons;
