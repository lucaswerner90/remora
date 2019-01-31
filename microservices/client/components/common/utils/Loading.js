import React, { PureComponent } from 'react';
import { Grid, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

export default class Loading extends PureComponent {
  render() {
    const { height = '100vh'} = this.props;
    return (
      <Grid container spacing={16} direction="row"
        justify="center"
        alignItems="center" style={{ height: height, marginTop:'5%'}}>
        <Grid item>
          <CircularProgress variant="indeterminate" />
        </Grid>
      </Grid>
    )
  }
}
