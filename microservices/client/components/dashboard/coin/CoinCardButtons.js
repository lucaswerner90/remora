import React, { Component } from 'react'
import { Grid, Button, IconButton } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';

export class CoinCardButtons extends Component {
  render() {
    const { coin } = this.props;
    return (
      <Grid container alignItems="flex-end">
        <Grid item xs={6}>
          <Button size="small">See more</Button>
        </Grid>
        <Grid item xs={6} style={{textAlign:'right'}}>
          <IconButton style={{ padding: '6px' }} aria-label="Add to favorites">
            <LaunchIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    );
  }
}

export default CoinCardButtons;
