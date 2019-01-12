import React from 'react';
import Grid from '@material-ui/core/Grid';
import Layout from '../components/Layout';
import FavoritesList from '../components/dashboard/favorites/FavoritesList';
import ExchangesList from '../components/dashboard/exchanges/ExchangesList';

export default () => {
  return (
    <Layout>
      <Grid container style={{ flexGrow: 1 }} spacing={24}>
        <Grid item xs={12}>
          <FavoritesList />
        </Grid>
        <Grid item xs={12}>
          <ExchangesList />
        </Grid>
        
      </Grid>
    </Layout>
  );
}
