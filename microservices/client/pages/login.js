import React, { Component } from 'react';

import fetch from 'isomorphic-unfetch';
import Router from 'next/router';
import getConfig from 'next/config';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmailOutlined';
import SecurityIcon from '@material-ui/icons/Security';
import { Typography, CircularProgress } from '@material-ui/core';

import Link from 'next/link';

const { publicRuntimeConfig } = getConfig();
const { api } = publicRuntimeConfig;

export class Login extends Component {
  
  state = {
    haveTried: false,
    loading: false,
    email: '',
    password: ''
  }

  postLogin = async () => {
    try {
      this.setState({ ...this.state, loading: true, haveTried:true });
      const postLoginRequestData = {
        method: 'POST',
        body: JSON.stringify({ email: this.state.email, password: this.state.password }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };
      const response = await fetch(`http://${api}/api/auth/login`, postLoginRequestData);
      if(response.status === 200){
        Router.push('/dashboard');
      }
      // If everything goes as expected
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ loading: false });
    }

  }
  render() {
    return (
      <Grid container justify="center" direction="column" alignItems="center" style={{ flexGrow: 1, height: '100vh'}} spacing={24}>
        <Grid item>
          <Typography align="center" variant="h3">
            rémora
          </Typography>
        </Grid>
        <Grid item>
          <FormControl required error={!this.state.email.length && this.state.haveTried}>
            <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel>
            <Input
              autoFocus={true}
              type="email"
              autoSave="false"
              autoComplete="false"
              value={this.state.email}
              onChange={ (event) => this.setState({...this.state, email: event.target.value})}
              startAdornment={
                <InputAdornment position="start">
                  <AlternateEmailIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl error={!this.state.password.length && this.state.haveTried} required>
            <InputLabel htmlFor="input-with-icon-adornment">Password</InputLabel>
            <Input
              autoSave="false"
              autoComplete="false"
              type="password"
              value={this.state.password}
              onChange={(event) => this.setState({ ...this.state, password: event.target.value })}
              startAdornment={
                <InputAdornment position="start">
                  <SecurityIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item>
          {!this.state.loading && <Button variant="contained" color="primary" disabled={!this.state.email.length || !this.state.password.length} fullWidth={true} onClick={this.postLogin}>Login</Button>}
          {this.state.loading && <CircularProgress variant="indeterminate"/>}
        </Grid>
        <Grid item>
          <Link href='/signin'>
            <Typography variant="h6" component="a" align="center">
              Crete an account
            </Typography>
          </Link>
          <Link href='/forgotpassword'>
            <Typography variant="h6" component="a" align="center">
              Forgot your password?
            </Typography>
          </Link>
        </Grid>
      </Grid>
    )
  }
}

export default Login;
