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
          <Grid container spacing={0} alignItems="center" justify="flex-start">
            <Grid item>
              <HeaderMenu />
            </Grid>
            <Grid item>
              <Link href="/">
                <Typography variant="h4" align="left">
                  rémora
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12} sm={12} md={9}>
          <Grid container spacing={0} alignItems="center" justify="flex-end">
            <Grid item >
              <Typography variant="body2" align="right" style={{marginRight:10}}>
                Welcome <strong>{name}</strong>!
              </Typography>
            </Grid>
            <Grid item>
              <Avatar alt={name} src={avatar} style={{textAlign:'right'}}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default connect(mapReduxStateToComponentProps)(Header);