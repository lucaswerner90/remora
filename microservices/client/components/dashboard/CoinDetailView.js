import React, {Component} from 'react';
import PropTypes from 'prop-types';


import { Grid, Typography, Paper, Fade } from '@material-ui/core';
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
import OrderInfo from './subcomponents/info/OrderInfo';

const mapReduxStateToComponentProps = state => ({
  selectedCoin: state.user.userPreferences.selectedCoin,
  coinInfo: state.coins.coins[state.user.userPreferences.selectedCoin]
});

const initialState = {
  volumeDifference: 0,
  pricesList: [],
  price: 0,
  previousBuyOrder: {},
  previousSellOrder: {},
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
    this.getAllProperties(selectedCoin);
    this.socket = io(api, { forceNew: true });
    this.socket.on(selectedCoin, this.onSocketData);
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
      case 'previous_order':
        info.order.hasDissapeared = true;
        this.setState({
          ...this.state,
          [info.type === 'buy' ? 'previousBuyOrder' : 'previousSellOrder']: info.order
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
            pricesList: [...this.state.pricesList, info.price].slice(1),
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
      const response = await fetch(`${api}/api/coin/property`, userRequestData);
      const { value = {} } = await response.json();
      return value;
    } else {
      return {};
    }
  }
  getCoinPricesList = async (coinID) => {
    const value = await this.getCoinProperty(coinID, 'prices_list');
    const prices = value && value.prices && value.prices.length ? value.prices : [];
    this.setState({ ...this.state, pricesList: prices });
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
  getPreviousOrders = async (coinID) => {
    const {order:previousBuyOrder={}} = await this.getCoinProperty(coinID, 'buy_order_previous');
    const { order: previousSellOrder = {} } = await this.getCoinProperty(coinID, 'sell_order_previous');
    previousBuyOrder.hasDissapeared = true;
    previousSellOrder.hasDissapeared = true;
    this.setState({ ...this.state, previousBuyOrder:previousBuyOrder, previousSellOrder:previousSellOrder});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCoin && nextProps.selectedCoin !== this.props.selectedCoin) {

      // Reset all the component state
      this.setState({ ...this.state, initialState });

      // Disconnect from the previous coin
      if (this.socket) this.socket.off(this.props.selectedCoin);

      // Stablish a new connection with the next coin
      this.socket.on(nextProps.selectedCoin, this.onSocketData);

      this.getAllProperties(nextProps.selectedCoin);
    }
  }
  getAllProperties = (coinID) =>{
    this.getPreviousOrders(coinID);
    this.getCoinPricesList(coinID);
    this.getCoinPrice(coinID);
    this.getVolumeDifference(coinID);
    this.getPriceChange(coinID);
  }
  render() {
    const { coinInfo = {exchange:'', name:'', symbol:'', url:''} } = this.props;

    const { pricesList = [], buyOrder, previousBuyOrder, previousSellOrder, sellOrder, priceChange = 0, price = 0, volumeDifference = 0 } = this.state;

    if (coinInfo.name) {
      return (
        <Fade in={coinInfo.name.length > 0} timeout={{enter:2*1000, exit:2*1000}}>
        
        <Grid container direction="row" spacing={0}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Paper elevation={1}>
                <Grid container spacing={24}>
                  <Grid item xs={12} style={{zIndex:100}}>
                    <Typography align="center" style={{ textTransform: 'uppercase' }} variant="body2">
                      {`${coinInfo.exchange}`}
                    </Typography>
                    <Typography align="center" variant="h5">
                      <strong>{`${coinInfo.name} (${coinInfo.symbol})`}</strong>
                      <IconButton aria-label="Open coin url" onClick={() => window.open(coinInfo.url, 'blank')}>
                        <OpenInNew />
                      </IconButton>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ marginBottom: '0px', marginTop: '-80px' }}>
                    <PriceChart prices={pricesList} buy={buyOrder.price ? buyOrder : previousBuyOrder} sell={sellOrder.price ? sellOrder : previousSellOrder} />
                  </Grid>
                  <Grid item xs={12} >
                    <BasicInfo volumeDifference={volumeDifference} price={price} priceChange={priceChange} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>


            <Grid item xs={12}>
              <Grid container spacing={16} justify="space-between">
                <Grid item xs={6}>
                  <OrderInfo order={buyOrder} previous={previousBuyOrder} message="Buy order" coinPrice={price} />
                </Grid>
                <Grid item xs={6}>
                  <OrderInfo order={sellOrder} previous={previousSellOrder} message="Sell order" coinPrice={price} />
                </Grid>
              </Grid>
            </Grid>
          
        </Grid>
        </Fade>
      );
    } else {
      return (
        <Fade in={coinInfo.name.length === 0} timeout={{enter: 500, exit:2*1000}}>
          <Grid container spacing={0} justify="center" style={{flexGrow:1, height:'90vh'}} alignItems="center">
            <Grid item xs={12}>
            </Grid>
            <Loading/>
          </Grid>
        </Fade>
      );
    }
  }
}

export default connect(mapReduxStateToComponentProps)(CoinDetailView);
