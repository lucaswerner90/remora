import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Layout from '../components/Layout';
import { withStyles } from '@material-ui/core/styles';
import CoinDetailView from '../components/dashboard/CoinDetailView';
import RightSideView from '../components/dashboard/RightSideView';


const styles = () => ({
  root: {
    flexGrow: 1,
  },
});
class Dashboard extends Component {
  render() {

    return (
      <Layout>
        <Grid container style={{ flexGrow: 1, height: '100vh' }} spacing={40}>
          <Grid item xs={9}>
            <CoinDetailView/>
          </Grid>
          <Grid item xs={3}>
            <RightSideView/>
          </Grid>
        </Grid>
      </Layout>
    )
  }
}

export default withStyles(styles)(Dashboard);
