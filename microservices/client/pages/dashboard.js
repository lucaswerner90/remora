import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';

import Layout from '../src/components/Layout';
import CoinDetailView from '../src/components/dashboard/CoinDetailView';
import RightSideView from '../src/components/dashboard/RightSideView';
import CoinChat from '../src/components/dashboard/subcomponents/chat/CoinChat';
import Auth from '../src/components/authentication/Auth';

import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';
import Head from 'next/head';
import {connect} from 'react-redux';
import { updateUserPreferences, updateUserInfo } from '../src/redux/actions/userPreferencesActions';
import { updateAllCoins } from '../src/redux/actions/coinsActions';
import Loading from '../src/components/common/utils/Loading';

const { publicRuntimeConfig } = getConfig();
const { api } = publicRuntimeConfig;

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});
const mapReduxStateToComponentProps = state => ({
  price: state.live.price,
  coinInfo: state.coins.all[state.user.userPreferences.selectedCoin],
});

class Dashboard extends React.Component {
  
  state = {
    loading: true
  }
  updateUserLastLoginLocation = async(email = '', country = '') =>{
    const request = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ email, country }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return fetch(`${api}/api/user/location`, request);
  }
  async componentDidMount() {
    const auth = new Auth();
    if (!auth.isAuthenticated()) {
      auth.login();
    } else {
      // Parse the profile coming from Auth0
      const userInfo = auth.getProfile();
      const { email = '' } = userInfo;

      // Get the country where the user is currently logged in.
      const { country_code = '' } = userInfo['https://remora.app/geoip'];
      await this.updateUserLastLoginLocation(email, country_code);
      
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
    const { price = 0, coinInfo = {name: ''} } = this.props;
    if (loading) {
      return (
        <React.Fragment>
          <Fade in={loading} timeout={{ enter: 2 * 1000, exit: 2 * 1000 }}>
            <Grid container justify="center" direction="row" alignContent="center" style={{ flexGrow: 1, height: '110vh' }} spacing={40}>
              <Grid item xs={12} sm={12} md={12}>
                <Typography align="center" variant="h3">
                  rémora
                </Typography>
              </Grid>
              <Loading/>
            </Grid>
          </Fade>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Head>
            <title>Rémora 🐋 {coinInfo.name} - {price}$</title>
          </Head>
          <Fade in={!loading} timeout={{ enter: 2 * 1000, exit: 5 * 1000 }}>
            <Layout>
              <Grid container style={{ flexGrow: 1, height: '150vh' }} spacing={24}>
                <Grid item xs={12} sm={12} md={9} style={{ borderRight: '1px solid #ffffff40'}}>
                  <CoinDetailView />
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <RightSideView />
                </Grid>
              </Grid>
              <CoinChat />
            </Layout>
          </Fade>
        </React.Fragment>
      );
    }
  }
}

export default connect(mapReduxStateToComponentProps, { updateUserPreferences, updateUserInfo, updateAllCoins })(withStyles(styles)(Dashboard));
