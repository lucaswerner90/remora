import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import Link from 'next/link';
import HeaderMenu from './HeaderMenu';
const Header = () => {
  return (
    <Grid container spacing={0} justify="space-between"
      alignItems="center">
        <Grid item>
          <HeaderMenu />
        </Grid>
        <Grid item xs={9}>
          <Link href="/">
            <Typography style={{fontSize:'1.25rem', fontWeight:500}} align="left">
              <a>rémora</a>
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" component="span" align="right">
            <a>Lucas Werner</a>
          </Typography>
        </Grid>
      </Grid>
  )
}
export default Header;