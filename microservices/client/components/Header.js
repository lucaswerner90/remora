import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';
import Link from 'next/link';
import HeaderMenu from './HeaderMenu';

import { connect } from 'react-redux';

const mapReduxStateToComponentProps = state => ({
  name: state.user.userInfo.name,
  username: state.user.userInfo.username,
});
export class Header extends Component {

  render() {
    const { username = '', name = '' } = this.props;
    return (
      <Grid container spacing={0} justify="space-between"
        alignItems="center">
        <Grid item>
          <HeaderMenu />
        </Grid>
        <Grid item xs={1}>
          <Link href="/">
            <Typography style={{ fontSize: '1.25rem', fontWeight: 500 }} align="left">
              <a>rémora</a>
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="body2" align="right">
            {name}  ( {username} )
          </Typography>
        </Grid>
      </Grid>
    )
  }
}

export default connect(mapReduxStateToComponentProps)(Header);