import React from 'react';
import PropTypes from 'prop-types';
import SocketComponent from './SocketComponent';
import { Grid, Typography, Card, CardContent, CardActions } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';


import CoinProperty from '../dashboard/subcomponents/CoinProperty';
import GenericPriceChart from '../dashboard/subcomponents/charts/GenericPriceChart';
import CoinCardButtons from '../dashboard/subcomponents/CoinCardButtons';


const getTimeAgo = (date = new Date()) => {
  const now = Date.now();
  const difference = Math.round((now - date.getTime()) / 1000);

  const timeInMinutes = Math.round(difference / 60);
  const timeInHours = Math.round(timeInMinutes / 60);
  if (timeInHours >= 1) {
    return `Created ${Math.round(timeInMinutes)} hours ago`;
  }
  if (timeInMinutes >= 1) {
    return `Created ${Math.round(timeInMinutes)} minutes ago`;
  }
  return `Created ${difference} seconds ago`;
}

const textStyle = { color: 'grey', fontSize: '0.625rem' };

const renderOrderInfo = ({price='-',quantity='-',type=''}, against='') => {
  return (
    <Grid item xs={12}>
      <Typography style={{ ...textStyle, fontSize: '0.75rem' }}>
        <strong>{type === 'buy' ? 'BUY' : 'SELL'}</strong> {`at ${price}${against} for `}<strong>{`${quantity}$`}</strong>
      </Typography>
    </Grid>
  );
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
    super(props, `${props.coin.exchange}_${props.coin.id}`);
  }
  onSocketData = ({ info = {}, type = '' }) => {
    switch (type) {
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

    const updatedCoinInfo = { ...this.state, ...coin };

    let hasPriceIncreased = false;
    if (pricesList.length) {
      const lastPrice = pricesList[pricesList.length - 1] - pricesList[pricesList.length - 2];
      hasPriceIncreased = lastPrice > 0;
    }
    return (
      <Grid key={`${name}_${id}`} item xs={tileSize}>
        <Card>
          <CardContent>
            <Grid container style={{ flexGrow: 1 }} spacing={isFavorite ? 16:0}>

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
                <Typography style={{color: hasPriceIncreased ? green[500] : red[500]}} variant="body1">
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
              {(() => {
                if (buyOrder.price) {
                  return renderOrderInfo(buyOrder,against)
                }
              })()}
              {(() => {
                if (sellOrder.price) {
                  renderOrderInfo(sellOrder, against)
                }
              })()}
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
