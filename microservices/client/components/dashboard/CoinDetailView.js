import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';


import io from 'socket.io-client';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { backend = 'localhost:8080' } = publicRuntimeConfig;

import { connect } from 'react-redux';
import { getUserSelectedCoin, getUserFavoriteCoins } from '../../redux/actions/userPreferencesActions';
import { getCoinByID } from '../../redux/actions/coinsActions';


import PriceChart from './subcomponents/charts/PriceChart';
import { red, lightGreen } from '@material-ui/core/colors';
import { formatPrice } from '../common/utils/Format';

const mapReduxStateToComponentProps = state => ({
  selectedCoin: state.user.userPreferences.selectedCoin,
  coinInfo: state.coins.selected,
  allCoins: state.coins.coins
});

const initialState = {
  volumeDifference: 0,
  pricesList: [],
  price: 0,
  buyOrder: {},
  sellOrder: {},
  priceChange: {}
}
export class CoinDetailView extends Component {
  state = { ...initialState };

  static propTypes = {
    selectedCoin: PropTypes.string.isRequired,
    favorites: PropTypes.array.isRequired,
    coinInfo: PropTypes.object.isRequired
  }

  static defaultProps = {
    selectedCoin: '',
    favorites: [],
    coinInfo: {}
  }
  constructor(props) {
    super(props); 
  }

  componentWillMount() {
    this.props.getCoinByID(this.props.selectedCoin);
    this.socket = io(backend, { forceNew: true });
    this.socket.on(this.props.selectedCoin, this.onSocketData);
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
        this.setState({ ...this.state, priceChange: info.price });
        break;
      case 'price_list':
        this.setState({ ...this.state, pricesList: info.pricesList || [] });
        break;

      case 'latest_price':
        this.setState({ ...this.state, price: info.price });
        break;

      default:
        break;
    }
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCoin !== this.props.selectedCoin) {

      // Get the upcoming coin
      this.props.getCoinByID(nextProps.selectedCoin);

      // Reset all the component state
      this.setState({ ...this.state, initialState });

      // Disconnect from the previous coin
      if (this.socket) this.socket.off(this.props.selectedCoin);

      // Stablish a new connection with the next coin
      this.socket.on(nextProps.selectedCoin, this.onSocketData);
    }
    return true;
  }
  renderLoading = () => {
    return (
      <Grid container spacing={40} justify="center" style={{ height: '90vh' }} alignItems="center">
        <Grid item>
          <CircularProgress variant="indeterminate" />
        </Grid>
      </Grid>
    );
  }
  renderBasicInfo = () => {
    const { volumeDifference = 0, price = 0, priceChange = 0 } = this.state;
    return (
        <Grid container spacing={40} alignItems="center" alignContent="space-around">
          <Grid item xs={4}>
            <Typography align="center" variant="body2">
              VOLUME DIFFERENCE
            </Typography>
            <Typography align="center" style={{ color: volumeDifference < 0 ? red[500] : lightGreen[500]}} variant="h3">
              {volumeDifference}
              <Typography style={{ display: 'inline-block', color: volumeDifference < 0 ? red[500] : lightGreen[500]}} align="center" variant="h5">
                %
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align="center" variant="body2">
              PRICE
            </Typography>
            <Typography align="center" variant="h3">
              {formatPrice(price)}
              <Typography style={{ display: 'inline-block' }} align="center" variant="h5">
                $
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align="center" variant="body2">
              PRICE 24HR
            </Typography>
            <Typography align="center" style={{ color: priceChange < 0 ? red[500] : lightGreen[500]}} variant="h3">
              {priceChange}
              <Typography style={{ display: 'inline-block', color: priceChange < 0 ? red[500] : lightGreen[500]}} align="center" variant="h5">
                %
              </Typography>
            </Typography>
          </Grid>
        </Grid>
    );
  }
  renderOrder = ({ price = '-', currentValues = { position: '-', quantity: '-' }, hasBeenExecuted = undefined }, coinPrice = 0) => {
    let margin = '-';
    if (!isNaN(price) && coinPrice > 0) {
      margin = Math.round((Math.abs(price - coinPrice) / coinPrice) * 10000)/100;
      return (
        <React.Fragment>
          <Grid item xs={2}>
            <Typography color="primary" align="center" variant="body2">
              PRICE
            </Typography>
            <Typography color="primary" align="center" variant="h5">
              {price}$
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography color="primary" align="center" variant="body2">
              QUANTITY
            </Typography>
            <Typography color="primary" align="center" variant="h5">
              {currentValues.quantity}$
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography color="primary" align="center" variant="body2">
              MARGIN TO PRICE
            </Typography>
            <Typography color="primary" align="center" variant="h5">
              {margin}%
            </Typography>
          </Grid>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
  render() {
    const { coinInfo = {} } = this.props;
    const { pricesList = [], buyOrder = {},sellOrder = {}, price = 0 } = this.state;

    if (pricesList.length > 0 && price > 0) {
      return (
        <Grid container direction="row" justify="space-around" alignItems="center" spacing={40} style={{ borderRight:'1px solid #ffffff63'}}>

          <Grid item xs={12}>
            <Typography align="center" style={{ textTransform:'uppercase'}} variant="body2">
              {`${coinInfo.exchange}`}
            </Typography>
            <Typography align="center" variant="h5">
              <strong>{`${coinInfo.name} (${coinInfo.symbol})`}</strong>
            </Typography>
          </Grid>

          {this.renderBasicInfo()}

          <Grid item xs={12} style={{ marginTop: '-20px', marginBottom: '-80px' }}>
            <PriceChart prices={pricesList} buy={buyOrder} sell={sellOrder}/>
          </Grid>

          
          

            <Grid item xs={12}>
              <Grid container style={{ marginTop: '20px' }} spacing={40} alignItems="center" alignContent="space-between">

                <Grid item xs={3} style={{borderRight: '1px solid white'}}>
                  <Typography color="primary" align="left" variant="h4">
                    BUY ORDER
                  </Typography>
                </Grid>
                
              {buyOrder.price && this.renderOrder(buyOrder, price)}
                
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid container style={{marginTop:'20px'}} spacing={40} alignItems="center" alignContent="space-between">
                <Grid item xs={3} style={{borderRight: '1px solid white'}}>
                  <Typography color="primary" align="left" variant="h4">
                    SELL ORDER
                  </Typography>
                </Grid>
                
              {sellOrder.price && this.renderOrder(sellOrder, price)}
                
              </Grid>
            </Grid>

        </Grid>
      );
    } else {
      return this.renderLoading();
    }
  }
}

export default connect(mapReduxStateToComponentProps, { getUserSelectedCoin, getUserFavoriteCoins, getCoinByID })(CoinDetailView);
