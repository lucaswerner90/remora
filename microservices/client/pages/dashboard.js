import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';

import Layout from '../components/Layout';
import CoinDetailView from '../components/dashboard/CoinDetailView';
import RightSideView from '../components/dashboard/RightSideView';
import CoinChat from '../components/dashboard/subcomponents/chat/CoinChat';
import Auth from '../components/authentication/Auth';

import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';

import {connect} from 'react-redux';
import { updateUserPreferences, updateUserInfo } from '../redux/actions/userPreferencesActions';
import { updateAllCoins } from '../redux/actions/coinsActions';
import { updateChartTimeline } from '../redux/actions/dashboardActions';
import Loading from '../components/common/utils/Loading';

const { publicRuntimeConfig } = getConfig();
const { api } = publicRuntimeConfig;

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

const introMessages = [
  "I'll show you their footprints my captain...",
  "We're making the impossible...possible! Help us!",
  "Don't forget to chat with the other remoras in the sea!",
  "Let them work for us for once...",
  "We make it easy...",
];

class Dashboard extends React.Component {
  
  state = {
    loading: true
  }

  async componentDidMount() {
    const auth = new Auth();
    if (!auth.isAuthenticated()) {
      auth.login();
    } else {
      // Parse the profile coming from Auth0
      const userInfo = auth.getProfile();
      const { email = '' } = userInfo;

      // Get the user preferences
      const userPreferencesFetch = await fetch(`${api}/api/user/preferences?email=${email}`);
      const userPreferences = await userPreferencesFetch.json();

      const allCoinsFetch = await fetch(`${api}/api/coin/all`);
      const coins = await allCoinsFetch.json();
  
      Object.keys(coins).map(coinID => coins[coinID] = JSON.parse(coins[coinID]));
  
      this.props.updateUserPreferences(userPreferences);
      this.props.updateUserInfo(userInfo);
      this.props.updateAllCoins(coins);
      
      this.setState({ loading: false });
    }
  }
  render() {
    const { loading = true } = this.state;
    if (loading) {
      return (
        <Fade in={loading} timeout={{ enter: 2 * 1000, exit: 2 * 1000 }}>
          <Grid container justify="center" direction="row" alignContent="center" style={{ flexGrow: 1, height: '110vh' }} spacing={40}>
            <Grid item xs={12}>
              <Typography align="center" variant="h3">
                rémora
              </Typography>
            </Grid>
            <Loading/>
            <Grid item xs={12}>
              <Typography align="center" variant="h6">
                {introMessages[Math.round(Math.random() * (introMessages.length - 1))]}
              </Typography>
            </Grid>
          </Grid>
        </Fade>
      );
    } else {
      return (
        <Fade in={!loading} timeout={{ enter: 2 * 1000, exit: 5 * 1000 }}>
          <Layout>
            <Grid container style={{ flexGrow: 1, height: '150vh' }} spacing={24}>
              <Grid item xs={9} style={{ borderRight: '1px solid #ffffff40'}}>
                <CoinDetailView />
              </Grid>
              <Grid item xs={3}>
                <RightSideView />
              </Grid>
            </Grid>
            <CoinChat />
          </Layout>
        </Fade>
      );
    }
  }
}

export default connect(null, { updateUserPreferences, updateUserInfo, updateAllCoins, updateChartTimeline })(withStyles(styles)(Dashboard));
