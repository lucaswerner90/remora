import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography, Fade } from '@material-ui/core';
import Auth from '../src/components/authentication/Auth';
import Loading from '../src/components/common/utils/Loading';

export class CallbackPage extends Component {

  componentDidMount() {
    const auth = new Auth();
    auth.handleAuthentication();
  }

  render() {
    return (
      <Fade in={true} timeout={{enter:2*1000,exit:2*1000}}>
        <Grid container justify="center" direction="row" alignContent="center" style={{ flexGrow: 1, height: '100vh' }} spacing={40}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography align="center" variant="h3">
              rémora
          </Typography>
          </Grid>
          <Loading />
        </Grid>
      </Fade>
    )
  }
}

export default CallbackPage;
