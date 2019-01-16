import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import Link from 'next/link';
const Header = () => {
  return (
    <Grid container style={{ height: '40px' }} spacing={24} style={{ borderBottom:'1px solid #05354a'}}>
        <Grid item xs={3}>
          <Link href="/">
              <Typography variant="h5" align="left">
                <a>Rémora</a>
              </Typography>
          </Link>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" align="center">
            <a>Dashboard</a>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2" align="right">
            <a>CONFIG</a>
          </Typography>
        </Grid>
      </Grid>
  )
}
export default Header;