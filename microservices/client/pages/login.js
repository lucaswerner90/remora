import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Auth from '../src/components/authentication/Auth';
import Loading from '../src/components/common/utils/Loading';
import Router from 'next/router';

export class CallbackPage extends Component {

  componentDidMount() {
    const auth = new Auth();
    if (!auth.isAuthenticated()) {
      auth.login();
    } else {
      Router.push("/dashboard");
    }
  }

  render() {
    return (
      <Grid container justify="center" direction="row" alignContent="center" style={{ flexGrow: 1, height: '100vh' }} spacing={40}>
        <Grid item xs={12} sm={12} md={12}>
          <Typography align="center" variant="h3">
            rémora
          </Typography>
        </Grid>
        <Loading/>
      </Grid>
    )
  }
}

export default CallbackPage;
