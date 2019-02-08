import React, {Component} from 'react';
import PropTypes from 'prop-types';


import { Grid, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import OpenInNew from '@material-ui/icons/OpenInNew';


import io from 'socket.io-client';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { api } = publicRuntimeConfig;

import { connect } from 'react-redux';


import PriceChart from './subcomponents/charts/PriceChart';
import BasicInfo from './subcomponents/info/CoinBasicInfo';
import Loading from '../common/utils/Loading';
import TabsInfo from './subcomponents/info/TabsInfo';

const mapReduxStateToComponentProps = state => ({
  selectedCoin: state.user.userPreferences.selectedCoin,
  coinInfo: state.coins.coins[state.user.userPreferences.selectedCoin]
});

const initialState = {
  volumeDifference: 0,
  pricesList: [],
  price: 0,
  buyOrder: {},
  sellOrder: {},
  priceChange: 0
}
export class CoinDetailView extends Component {
  state = { ...initialState };

  static propTypes = {
    selectedCoin: PropTypes.string.isRequired,
    coinInfo: PropTypes.object.isRequired,
  }

  static defaultProps = {
    selectedCoin: '',
    coinInfo: {}
  }

  constructor(props) {
    super(props); 
  }

  componentDidMount() {
    const { selectedCoin = '' } = this.props;
    this.socket = io(api, { forceNew: true });
    this.socket.on(selectedCoin, this.onSocketData);
    this.getCoinPricesList(selectedCoin);
    this.getCoinPrice(selectedCoin);
  }

  onSocketData = ({ info = {}, message = '' }) => {
    switch (message) {
      case 'volume_difference':
        this.setState({ ...this.state, volumeDifference: info.volumeDifference });
        break;
      case 'order':
        this.setState({
          ...this.state,
          [info.type === 'buy' ? 'buyOrder' : 'sellOrder']: info.order
        });
        break;
      case 'price_change_24hr':
        this.setState({ ...this.state, priceChange: parseFloat(info.price) });
        break;
      case 'latest_price':
        if (info.price !== this.state.price) {
          this.setState({
            ...this.state,
            price: info.price,
            pricesList: [...this.state.pricesList.slice(1), info.price],
          });
        }
        break;
      default:
        break;
    }
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  getCoinProperty = async (coinID, property) => {
    if (coinID) {
      const userRequestData = {
        method: 'POST',
        body: JSON.stringify({ property, coinID }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch(`${document.location.origin}:8080/api/coin/property`, userRequestData);
      const { value = {} } = await response.json();
      return value;
    } else {
      return {};
    }
  }
  getCoinPricesList = async (coinID) => {
    const value = await this.getCoinProperty(coinID, 'prices_list');
    const prices = value && value.prices && value.prices.length ? value.prices : [];
    this.setState({ ...this.state, pricesList: prices ? prices.splice(Math.round(prices.length / 2)) : [] });
  }
  getCoinPrice = async (coinID) => {
    const value = await this.getCoinProperty(coinID, 'price');
    const price = value && value.price ? value.price : 0;
    this.setState({ ...this.state, price });
  }
  getVolumeDifference = async (coinID) => {
    const value = await this.getCoinProperty(coinID, 'volume_difference');
    const volumeDifference = value && value.volumeDifference ? value.volumeDifference : 0;
    this.setState({ ...this.state, volumeDifference });
  }
  getPriceChange = async (coinID) => {
    const value = await this.getCoinProperty(coinID, 'price_change_24hr');
    const priceChange = value && value.price ? value.priceChange : 0;
    this.setState({ ...this.state, priceChange });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCoin && nextProps.selectedCoin !== this.props.selectedCoin) {

      // Reset all the component state
      this.setState({ ...this.state, initialState });

      // Disconnect from the previous coin
      if (this.socket) this.socket.off(this.props.selectedCoin);

      // Stablish a new connection with the next coin
      this.socket.on(nextProps.selectedCoin, this.onSocketData);

      this.getCoinPricesList(nextProps.selectedCoin);
      this.getCoinPrice(nextProps.selectedCoin);
      this.getVolumeDifference(nextProps.selectedCoin);
      this.getPriceChange(nextProps.selectedCoin);
    }
  }

  render() {
    const { coinInfo = {exchange:'', name:'', symbol:'', url:''} } = this.props;

    const { pricesList = [], buyOrder = {}, sellOrder = {}, priceChange = 0, price = 0, volumeDifference = 0 } = this.state;
    if (coinInfo.name) {
      return (
        <Grid container direction="row" justify="space-around" alignItems="center" spacing={16}>

          <Grid item xs={12}>
            <Typography align="center" style={{ textTransform:'uppercase'}} variant="body2">
              {`${coinInfo.exchange}`}
            </Typography>
            <Typography align="center" variant="h5">
              <strong>{`${coinInfo.name} (${coinInfo.symbol})`}</strong>
              <IconButton aria-label="Open coin url" onClick={() => window.open(coinInfo.url, 'blank')}>
                <OpenInNew />
              </IconButton>
            </Typography>
          </Grid>
          
          <Grid item xs={12} style={{ marginTop: '0px', marginBottom: '0px' }}>
            <PriceChart prices={pricesList} buy={buyOrder} sell={sellOrder}/>
          </Grid>

          <BasicInfo volumeDifference={volumeDifference} price={price} priceChange={priceChange} />

          <Grid item xs={12}>
            <TabsInfo sellOrder={sellOrder} buyOrder={buyOrder} coinPrice={price}/>
          </Grid>
        </Grid>
      );
    } else {
      return <Loading height={'90vh'} message="Waiting for the whales to appear..."/>
    }
  }
}

export default connect(mapReduxStateToComponentProps)(CoinDetailView);
