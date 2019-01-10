import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Layout from '../components/Layout';
import Coin from '../components/dashboard/coin/Coin';
import DashboardTable from '../components/dashboard/DashboardTable';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "90%",
    margin: "0 auto",
  },
});

class Dashboard extends React.Component {
  state = {
    coin: 'ETHUSDT',
    exchange: 'binance'
  };
  constructor() {
    super();
  }

  render() {
    const { classes } = this.props;
    return (
      <Layout>
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Dashboard > </strong>{this.state.exchange.toUpperCase()} > {this.state.coin}
            </Typography>
          </Grid>
          <Grid item xs={12} >
            <Coin symbol={this.state.coin}
              exchange={this.state.exchange}
            />
          </Grid>
        </Grid>
        
        <Grid container className={classes.root} spacing={24}>
          <Grid item xs={12} >
            <DashboardTable exchange={this.state.exchange}/>
          </Grid>
        </Grid>

      </Layout>
    );
  }
}

export default withStyles(styles)(Dashboard);
