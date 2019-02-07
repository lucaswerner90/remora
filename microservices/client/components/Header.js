import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';
import Link from 'next/link';
import HeaderMenu from './HeaderMenu';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';

const mapReduxStateToComponentProps = state => ({
  name: state.user.userInfo.name,
  avatar: state.user.userInfo.picture,
  username: state.user.userInfo.username,
});
export class Header extends Component {

  render() {
    const { avatar = '', name = '' } = this.props;
    return (
      <Grid container spacing={0} justify="space-between"
        alignItems="center">
        <Grid item>
          <HeaderMenu />
        </Grid>
        <Grid item xs={1}>
          <Link href="/">
            <Typography variant="h4" align="left">
              rémora
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2" align="right">
            Welcome <strong>{name}</strong>!
          </Typography>
        </Grid>
        <Grid item>
          <Avatar alt={name} src={avatar} style={{textAlign:'right'}}/>
        </Grid>
      </Grid>
    )
  }
}

export default connect(mapReduxStateToComponentProps)(Header);