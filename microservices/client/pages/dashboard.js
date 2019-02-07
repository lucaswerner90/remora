import React from 'react';
import Grid from '@material-ui/core/Grid';
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

const { publicRuntimeConfig } = getConfig();
const { api } = publicRuntimeConfig;

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

class Dashboard extends React.Component {
  async componentDidMount() {
    const auth = new Auth();
    if (!auth.isAuthenticated()) {
      auth.login();
    } else {
      // Parse the profile coming from Auth0
      const userInfo = auth.getProfile();
      const { email = '' } = userInfo;

      const userRequestData = {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const userPreferencesFetch = await fetch(`http://${api}/api/user/preferences`, userRequestData);
      const userPreferences = await userPreferencesFetch.json();
  
      const allCoinsFetch = await fetch(`http://${api}/api/coin/all`);
      const coins = await allCoinsFetch.json();
  
      Object.keys(coins).map(coinID => coins[coinID] = JSON.parse(coins[coinID]));
  
      this.props.updateUserPreferences(userPreferences);
      this.props.updateUserInfo(userInfo);
      this.props.updateAllCoins(coins);
    }
  }

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
        <CoinChat/>
      </Layout>
    )
  }
}

export default connect(null, { updateUserPreferences, updateUserInfo, updateAllCoins })(withStyles(styles)(Dashboard));
