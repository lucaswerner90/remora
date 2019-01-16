import React from 'react';
import PropTypes from 'prop-types';
import SocketComponent from './SocketComponent';
import { Grid, Typography, Card, CardContent, CardActions } from '@material-ui/core';

import CoinProperty from '../dashboard/subcomponents/CoinProperty';
import GenericPriceChart from '../dashboard/subcomponents/charts/GenericPriceChart';
import CoinCardButtons from '../dashboard/subcomponents/CoinCardButtons';


const textStyle = { color: 'white', fontSize: '0.625rem' };

const renderOrderInfo = ({ price = 0, hasBeenExecuted = false, currentValues = { quantity: 0}, type = '' }, against = '') => {
  if (price) {
    return (
      <Grid item xs={12}>
        <Typography style={{ ...textStyle, fontSize: '0.75rem' }}>
          <strong>{`Executed: ${hasBeenExecuted ? 'Not yet' : 'Yes!'}`}</strong>
        </Typography>
        <Typography style={{ ...textStyle, fontSize: '0.75rem' }}>
          {`${price}${against} for `}<strong>{`${currentValues.quantity}$`}</strong>
        </Typography>
      </Grid>
    );
  }else{
    return (
      <Grid item xs={12}>
        <Typography style={{ ...textStyle, fontSize: '0.75rem' }}>
          {`No ${type} order for now...`}
        </Typography>
      </Grid>
    );
  }
}

export class CoinSocketComponent extends SocketComponent {
  
  static propTypes = {
    coin: PropTypes.object.isRequired
  }

  static defaultProps = {
    coin: {}
  }

  state = {
    tendency: '',
    volumeDifference: '',
    priceChange:0,
    price: 0,
    pricesList: [],
    buyOrder:{},
    sellOrder: {},
  }
  constructor(props) {
    super(props, `${props.coin.id}`);
  }
  onSocketData = ({ info = {}, message = '' }) => {
    switch (message) {
      case 'volume_difference':
        this.setState({ ...this.state, ...info });
        break;
      case 'order':
        if (info.type === 'buy') {
          this.setState({ ...this.state, buyOrder:info });
        } else {
          this.setState({ ...this.state, sellOrder:info });
        }
        break;
      case 'price_change_24hr':
        this.setState({ ...this.state, priceChange: parseFloat(info.price) });
        break;
        case 'price_list':
        this.setState({ ...this.state, ...info });
        break;
        
      case 'latest_price':
        this.setState({ ...this.state, price: parseFloat(info.price) });
        break;
    
      default:
        break;
    }
  }
  render() {
    const { coin, tileSize, showExchange, isFavorite } = this.props;
    const { exchange = '', against = '$', coinSymbol = '', name = '', id = '' } = coin;

    const { price = 0, pricesList = [], priceChange = 0, volumeDifference = '', buyOrder = {}, sellOrder = {} } = this.state;

    // The updated coin info contains both the static properties 
    // and the ones coming from the socket!
    const updatedCoinInfo = { ...this.state, ...coin };

    let hasPriceIncreased = false;
    if (pricesList.length) {
      const lastPrice = pricesList[pricesList.length - 1] - pricesList[pricesList.length - 2];
      hasPriceIncreased = lastPrice > 0;
    }

    return (
      <Grid key={`${name}_${id}`} item xs={tileSize}>
        <Card style={{ background: 'transparent' }}>
          <CardContent>
            <Grid container style={{ flexGrow: 1 }} spacing={isFavorite ? 24:8}>

              <Grid item xs={8}>
                <Typography variant="body1">
                  <strong>{name}</strong> ({coinSymbol})
                    {showExchange ?
                      <span style={{ ...textStyle, marginLeft: '4px' }}>
                        {exchange.toUpperCase()}
                      </span>
                    : null}
                </Typography>
              </Grid>
              <Grid item xs={4} style={{ textAlign: 'right' }}>
                <Typography style={{color: hasPriceIncreased ? '#72CAA8' : 'white'}} variant="body1">
                  <strong>{`${price ? price : '...'}${against}`}</strong>
                </Typography>
              </Grid>
              
              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <CoinProperty value={Math.round(parseFloat(volumeDifference)*100)/100} symbol="%" label="Volume difference" />
              </Grid>

              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <CoinProperty value={Math.round(parseFloat(priceChange)*100)/100} symbol="%" label="Price 24hr"/>
              </Grid>
              
              

              <Grid item xs={12}>
                <GenericPriceChart isFavorite={isFavorite} prices={pricesList} buy={buyOrder} sell={sellOrder}/>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Buy
                </Typography>
                { renderOrderInfo(buyOrder, against) }
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Sell
                </Typography>
                {renderOrderInfo(sellOrder, against)}
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <CoinCardButtons coin={updatedCoinInfo}/>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default CoinSocketComponent;
