import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';


import Document from 'next/document';

import Layout from '../components/Layout';
import CoinDetailView from '../components/dashboard/CoinDetailView';
import RightSideView from '../components/dashboard/RightSideView';


import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';

import {connect} from 'react-redux';
import { updateUserPreferences, updateUserInfo } from '../redux/actions/userPreferencesActions';
import { updateAllCoins } from '../redux/actions/coinsActions';

import Router from 'next/router';
import CoinChat from '../components/dashboard/subcomponents/chat/CoinChat';


const { publicRuntimeConfig } = getConfig();
const { backend = 'localhost:8080' } = publicRuntimeConfig;

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

const redirectToLogin = res => {
  if (res) {
    res.writeHead(302, { Location: '/login' });
    res.end();
    res.finished = true;
  } else {
    Router.push('/login');
  }
}

class Dashboard extends Document {
  static async getInitialProps({req,res}) {
    if (false) {
      redirectToLogin(res);
    } else {
      const userRequestData = {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({email: 'wernerlucas12@gmail.com'}), 
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const userInfoFetch = await fetch(`http://${backend}/api/user/info`, userRequestData);
      const userInfo = await userInfoFetch.json();
  
      const userPreferencesFetch = await fetch(`http://${backend}/api/user/preferences`, userRequestData);
      const userPreferences = await userPreferencesFetch.json();
  
      const allCoinsFetch = await fetch(`http://${backend}/api/coin/all`);
      const coins = await allCoinsFetch.json();
      
      Object.keys(coins).map(coinID => coins[coinID] = JSON.parse(coins[coinID]));
      return { userInfo, userPreferences, coins };
    }
  }

  componentWillMount() {
    this.props.updateUserPreferences(this.props.userPreferences);
    this.props.updateUserInfo(this.props.userInfo);
    this.props.updateAllCoins(this.props.coins);
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
