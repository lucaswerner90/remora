import React, {Component} from 'react';
import PropTypes from 'prop-types';


import { Grid, Typography } from '@material-ui/core';


import io from 'socket.io-client';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { backend = 'localhost:8080' } = publicRuntimeConfig;

import { connect } from 'react-redux';


import PriceChart from './subcomponents/charts/PriceChart';
import OrderInfo from './subcomponents/info/OrderInfo';
import BasicInfo from './subcomponents/info/BasicInfo';
import Loading from '../common/utils/Loading';

const mapReduxStateToComponentProps = state => ({
  selectedCoin: state.user.userPreferences.selectedCoin,
  allCoins: state.coins.coins
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
    allCoins: PropTypes.object.isRequired
  }

  static defaultProps = {
    selectedCoin: '',
    allCoins: {}
  }

  constructor(props) {
    super(props); 
  }

  componentWillMount() {
    const { selectedCoin = '' } = this.props;
    this.socket = io(backend, { forceNew: true });
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
      case 'price_change_24hr':
        this.setState({ ...this.state, priceChange: parseFloat(info.price) });
        break;
      case 'price_list':
        this.setState({ ...this.state, pricesList: info.pricesList });
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

      // Reset all the component state
      this.setState({ ...this.state, initialState });

      // Disconnect from the previous coin
      if (this.socket) this.socket.off(this.props.selectedCoin);

      // Stablish a new connection with the next coin
      this.socket.on(nextProps.selectedCoin, this.onSocketData);
    }
  }

  render() {
    const { allCoins = {}, selectedCoin = '' } = this.props;
    const coinInfo = allCoins && allCoins[selectedCoin] ? allCoins[selectedCoin] : {};

    const { pricesList = [], buyOrder = {}, sellOrder = {}, priceChange = 0, price = 0, volumeDifference = 0 } = this.state;
    
    if (pricesList.length > 0 && priceChange !== 0 && price > 0 && coinInfo.name) {
      return (
        <Grid container direction="row" justify="space-around" alignItems="center" spacing={40} style={{ borderRight:'1px solid #ffffff63', height:'80vh'}}>

          <Grid item xs={12}>
            <Typography align="center" style={{ textTransform:'uppercase'}} variant="body2">
              {`${coinInfo.exchange}`}
            </Typography>
            <Typography align="center" variant="h5">
              <strong>{`${coinInfo.name} (${coinInfo.symbol})`}</strong>
            </Typography>
          </Grid>
          <BasicInfo volumeDifference={volumeDifference} price={price} priceChange={priceChange}/>

          <Grid item xs={12} style={{ marginTop: '0px', marginBottom: '-80px' }}>
            <PriceChart priceChange={priceChange} prices={pricesList} buy={buyOrder} sell={sellOrder}/>
          </Grid>

          
          

            <Grid item xs={12}>
              <Grid container spacing={40} alignItems="center"
              style={{height:'20vh', overflowY:'auto'}}
              alignContent="space-between">

                <Grid item xs={3} style={{borderRight: '1px solid white'}}>
                  <Typography color="primary" align="left" variant="h4">
                    BUY ORDER
                  </Typography>
                </Grid>
                  
                {buyOrder.price && <OrderInfo order={buyOrder} coinPrice={price}/>}
                  
              </Grid>
              <Grid container spacing={40} alignItems="center" alignContent="space-between">
                <Grid item xs={3} style={{borderRight: '1px solid white'}}>
                  <Typography color="primary" align="left" variant="h4">
                    SELL ORDER
                  </Typography>
                </Grid>
                
              {sellOrder.price && <OrderInfo order={sellOrder} coinPrice={price} />}
                
              </Grid>
            </Grid>

        </Grid>
      );
    } else {
      return <Loading height={'90vh'}/>
    }
  }
}

export default connect(mapReduxStateToComponentProps)(CoinDetailView);
