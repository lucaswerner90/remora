import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import Link from 'next/link';
const Header = () => {
  return (
      <Grid container style={{ height:'10vh' }} spacing={16}>
        <Grid item xs={12}>
          <Link href="/">
              <Typography variant="body1">
                <a>Rémora</a>
              </Typography>
          </Link>
        </Grid>
      </Grid>
  )
}
export default Header;