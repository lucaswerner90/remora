import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';
import Link from 'next/link';
import HeaderMenu from './HeaderMenu';
import MessageIcon from '@material-ui/icons/MessageOutlined';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';

import { connect } from 'react-redux';

const mapReduxStateToComponentProps = state => ({
  userName: state.user.userInfo.name
});
export class Header extends Component {

  render() {
    const { userName = '' } = this.props;
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
            {userName}
            <Badge badgeContent={4} color="secondary">
              <IconButton disabled={true}>
                <MessageIcon />
              </IconButton>
            </Badge>

          </Typography>
        </Grid>
      </Grid>
    )
  }
}

export default connect(mapReduxStateToComponentProps)(Header);