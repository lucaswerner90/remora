import React from 'react';
import CoinsList from './subcomponents/CoinsList';
import NotificationsList from './subcomponents/NotificationsList';
import Grid from '@material-ui/core/Grid';

class RightSideView extends React.Component {

  render() {
    return (
      <Grid container spacing={24} alignContent="center">
        <Grid item xs={12}>
          <CoinsList />
        </Grid>
        <Grid item xs={12}>
          <NotificationsList />
        </Grid>
      </Grid>
    );
  }
}

export default RightSideView;