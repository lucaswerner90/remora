import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Auth from '../components/authentication/Auth';
import Loading from '../components/common/utils/Loading';

export class CallbackPage extends Component {

  componentDidMount() {
    const auth = new Auth();
    auth.handleAuthentication();
  }

  render() {
    return (
      <Grid container justify="center" direction="row" alignContent="center" style={{ flexGrow: 1, height: '100vh' }} spacing={40}>
        <Grid item xs={12}>
          <Typography align="center" variant="h3">
            rémora
          </Typography>
        </Grid>
        <Loading/>
        <Grid item xs={12}>
          <Typography align="center" variant="body2">
            Reading your data to find the best whales for you...
          </Typography>
        </Grid>
      </Grid>
    )
  }
}

export default CallbackPage;
