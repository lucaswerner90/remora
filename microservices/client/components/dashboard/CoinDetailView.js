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

const mapReduxStateToComponentProps = state => ({
  selectedCoin: state.user.userPreferences.selectedCoin,
  favorites: state.user.userPreferences.favorites,
  coinInfo: state.coins.selected
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
    selectedCoin: {},
    favorites: [],
    coinInfo: {}
  }
  constructor(props) {
    super(props); 
  }

  componentWillMount() {
    this.props.getUserSelectedCoin();
    this.props.getUserFavoriteCoins();
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
        if (info.type === 'buy') {
          console.log(info.order)
          this.setState({ ...this.state, buyOrder: info.order });
        } else {
          this.setState({ ...this.state, sellOrder: info.order });
        }
        break;
      case 'price_change_24hr':
        this.setState({ ...this.state, priceChange: parseFloat(info.price) });
        break;
      case 'price_list':
        this.setState({ ...this.state, pricesList: [...info.pricesList] });
        break;

      case 'latest_price':
        this.setState({ ...this.state, price: parseFloat(info.price) });
        break;

      default:
        break;
    }
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.selectedCoin !== this.props.selectedCoin) {
      this.props.getCoinByID(nextProps.selectedCoin);
      this.setState({ ...this.state, initialState });
      if (this.socket) this.socket.off(this.props.selectedCoin);
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
      <React.Fragment>
        <Grid container spacing={40} alignItems="center" alignContent="space-around">
          <Grid item xs={4}>
            <Typography color="primary" align="center" variant="body2">
              VOLUME DIFFERENCE
            </Typography>
            <Typography color="primary" align="center" variant="h3">
              {volumeDifference | 0}%
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography color="primary" align="center" variant="body2">
              PRICE
            </Typography>
            <Typography color="primary" align="center" variant="h3">
              {price | 0}$
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography color="primary" align="center" variant="body2">
              PRICE 24HR
            </Typography>
            <Typography color="primary" align="center" variant="h3">
              {priceChange | 0}%
            </Typography>
          </Grid>
        </Grid>
        
      </React.Fragment>
    );
  }
  renderOrder = ({ price = '-', currentValues = { position: '-', quantity: '-' }, hasBeenExecuted= '-'}) => {
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
            HAS BEEN EXECUTED
          </Typography>
          <Typography color="primary" align="center" variant="h5">
            {hasBeenExecuted ? 'YES' : 'NO'}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography color="primary" align="center" variant="body2">
            CURRENT POSITION
          </Typography>
          <Typography color="primary" align="center" variant="h5">
            {currentValues.position}
          </Typography>
        </Grid>
      </React.Fragment>
    );
  }
  render() {
    const { favorites = [], selectedCoin = '', coinInfo = {} } = this.props;
    const { pricesList = [], buyOrder = {},sellOrder = {}, price = 0 } = this.state;
    const numFavorites = favorites.length;
    const selectedPosition = favorites.indexOf(selectedCoin);
    if (pricesList.length > 0 && price > 0) {
      return (
        <Grid container direction="row" justify="space-around" alignItems="center" spacing={40}>
          
          <Grid item xs={3}>
            {numFavorites > 0 && (
              <React.Fragment>
                <Typography align="right" variant="body2">
                  BINANCE
                </Typography>
                <Typography align="right" variant="body1">
                  {`< Bitcoin (BTC)`}
                </Typography>
              </React.Fragment>
            )}
            
          </Grid>
          <Grid item xs={6}>
            <Typography align="center" style={{ textTransform:'uppercase'}} variant="body2">
              {`${coinInfo.exchange}`}
            </Typography>
            <Typography align="center" variant="h5">
              <strong>{`${coinInfo.name} (${coinInfo.symbol})`}</strong>
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography align="left" variant="body2">
              BINANCE
            </Typography>
            <Typography align="left" variant="body1">
              {`Litecoin (LTC)>`}
            </Typography>
          </Grid>


          <Grid item xs={12} style={{marginTop:'-20px', marginBottom:'-40px'}}>
            <PriceChart prices={pricesList} buy={buyOrder} sell={sellOrder}/>
          </Grid>

          
          {this.renderBasicInfo()}

            <Grid item xs={12}>
              <Grid container style={{marginTop:'20px'}} spacing={40} alignItems="center" alignContent="space-between">
                <Grid item xs={3} style={{borderRight: '1px solid white'}}>
                  <Typography color="primary" align="left" variant="h4">
                    BUY ORDER
                  </Typography>
                </Grid>
                
                {this.renderOrder(buyOrder)}
                
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid container style={{marginTop:'20px'}} spacing={40} alignItems="center" alignContent="space-between">
                <Grid item xs={3} style={{borderRight: '1px solid white'}}>
                  <Typography color="primary" align="left" variant="h4">
                    SELL ORDER
                  </Typography>
                </Grid>
                
                {this.renderOrder(sellOrder)}
                
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
