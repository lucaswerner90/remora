import React from 'react';
import SocketComponent from './SocketComponent';
import { Grid, Typography, Card, CardContent, CardActions, IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import CoinProperty from '../dashboard/coin/CoinProperty';
import GenericPriceChart from '../dashboard/coin/GenericPriceChart';
import CoinCardButtons from '../dashboard/coin/CoinCardButtons';
import CoinStatus from '../dashboard/coin/CoinStatus';

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

    const { price, pricesList, priceChange, volumeDifference, buyOrder, sellOrder } = this.state;

    let sentiment = 0;
    if (priceChange > 0) sentiment++;
    if (buyOrder.quantity) sentiment++;
    if (volumeDifference > 0) sentiment++;
    if (!sellOrder.quantity) sentiment++;

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
                {isFavorite ?
                  <IconButton style={{ padding: '4px' }} aria-label="Remove from favorites">
                    <StarIcon fontSize="small" />
                  </IconButton>
                  :
                  <IconButton style={{ padding: '4px' }} aria-label="Add to favorites">
                    <StarBorderIcon fontSize="small" />
                  </IconButton>
                }
              </Grid>

              <Grid item xs={3} style={{ textAlign: 'right' }}>
                <CoinStatus value={sentiment}/>
              </Grid>
              <Grid item xs={3} style={{ textAlign: 'right' }}>
                <CoinProperty value={`${priceChange}%`} label="Price 24hr"/>
              </Grid>
              <Grid item xs={3} style={{ textAlign: 'right' }}>
                <CoinProperty value={`${volumeDifference}%`} label="Vol. difference"/>
              </Grid>
              <Grid item xs={3} style={{ textAlign: 'right' }}>
                <CoinProperty value={`${price}${against}`} label="Price"/>
              </Grid>

              <Grid item xs={12}>
                <GenericPriceChart prices={pricesList} />
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
