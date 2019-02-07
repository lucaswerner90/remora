import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography, CircularProgress } from '@material-ui/core';
import auth from '../components/authentication/Auth';

export class CallbackPage extends Component {

  componentDidMount() {
    auth.handleAuthentication();
  }

  render() {
    return (
      <Grid container justify="center" direction="column" alignItems="center" style={{ flexGrow: 1, height: '100vh' }} spacing={24}>
        <Grid item>
          <Typography align="center" variant="h3">
            rémora
          </Typography>
        </Grid>
        <CircularProgress variant="indeterminate" />
        <Grid item xs={12}>
          <Typography align="center" variant="body2">
            Processing your data...
          </Typography>
        </Grid>
      </Grid>
    )
  }
}

export default CallbackPage;
