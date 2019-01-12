import React from 'react';
import SocketComponent from './SocketComponent';
import { Grid, Typography, Card, CardContent, CardActions } from '@material-ui/core';


import CoinProperty from '../dashboard/coin/CoinProperty';
import GenericPriceChart from '../dashboard/coin/GenericPriceChart';
import CoinCardButtons from '../dashboard/coin/CoinCardButtons';

export class CoinSocketComponent extends SocketComponent {
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
    const { exchange = '', against = '$', coinSymbol = '', url = '', name = '', id = '' } = coin;

    const { price = 0, pricesList = [], priceChange = 0, volumeDifference = '', buyOrder = {}, sellOrder = {} } = this.state;
    
    let hasPriceIncreased = false;
    if (pricesList.length) {
      const lastPrice = pricesList[pricesList.length - 1] - pricesList[pricesList.length - 2];
      hasPriceIncreased = lastPrice > 0;
    }
    return (
      <Grid key={`${name}_${id}`} item xs={tileSize}>
        <Card>
          <CardContent>
            <Grid container style={{ flexGrow: 1 }} spacing={0}>

              <Grid item xs={8}>
                <Typography variant="body1">
                  <strong>{name}</strong> ({coinSymbol})
                    {showExchange ?
                      <span style={{ color: 'grey', fontSize: '0.625rem', marginLeft: '4px' }}>
                        {exchange.toUpperCase()}
                      </span>
                    : null}
                </Typography>
              </Grid>
              <Grid item xs={4} style={{ textAlign: 'right' }}>
                <Typography style={{color: hasPriceIncreased ? 'green' : 'red'}} variant="body1">
                  <strong>{`${price ? price : '...'}${against}`}</strong>
                </Typography>
              </Grid>
              
              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <CoinProperty value={volumeDifference} symbol="%" label="Volume difference" />
              </Grid>

              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <CoinProperty value={priceChange} symbol="%" label="Price 24hr"/>
              </Grid>
              

              <Grid item xs={12}>
                <GenericPriceChart prices={pricesList} buy={buyOrder} sell={sellOrder}/>
              </Grid>

            </Grid>
          </CardContent>
          <CardActions>
            <CoinCardButtons coin={id} url={url} />
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default CoinSocketComponent
