import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import coinSocket from '../../../common/socket/CoinSocket';
import { formatPrice } from '../../../common/utils/Format';

export class Coin extends Component {
  
  state = {
    macd: 0,
    volume: 0,
    price: 0,
    priceChange: 0
  }

  static propTypes = {
    coin: PropTypes.object.isRequired,
    isFavorite: PropTypes.bool.isRequired,
    markAsFavorite: PropTypes.func.isRequired,
    selectCoin: PropTypes.func.isRequired,
    howManyFavorites: PropTypes.number.isRequired
  }
  macdDifferenceCallback = ({info}) =>{
    const { macdDifference } = info;
    this.setState({ ...this.state, macd: macdDifference.difference });
  }
  volumeDifferenceCallback = ({info}) =>{
    const { volumeDifference } = info;
    this.setState({ ...this.state, volume: volumeDifference.difference });
  }
  priceCallback = ({info}) => {
    const { price } = info;
    this.setState({ ...this.state, price });
  }
  priceChangeCallback = ({info}) => {
    const { price } = info;
    this.setState({ ...this.state, priceChange: price });
  }

  componentDidMount(){
    const { coin } = this.props;
    // coinSocket.openSpecificConnection(coin.id, 'macd_difference', this.macdDifferenceCallback);
    // coinSocket.openSpecificConnection(coin.id, 'volume_difference', this.volumeDifferenceCallback);
    coinSocket.openSpecificConnection(coin.id, 'latest_price', this.priceCallback);
    coinSocket.openSpecificConnection(coin.id, 'price_change_24hr', this.priceChangeCallback);
  }
  componentWillUnmount() {
    const { coin } = this.props;
    // coinSocket.closeSpecificConnection(coin.id, 'macd_difference');
    // coinSocket.closeSpecificConnection(coin.id, 'volume_difference');
    coinSocket.closeSpecificConnection(coin.id, 'latest_price');
    coinSocket.closeSpecificConnection(coin.id, 'price_change_24hr');
  }
  render() {
    const { isFavorite, coin, markAsFavorite, selectCoin, howManyFavorites = 1 } = this.props;
    const { price, volume = 0, macd = 0, priceChange } = this.state;
    const color = isFavorite ? 'textPrimary' : 'textSecondary';
    if (coin) {
      return (
        <ListItem key={coin.id} onClick={() => selectCoin(coin.id)} dense button>
          <ListItemText
            primary={
              <React.Fragment>
                <Grid container alignItems="center" justify="space-between">
                  <Grid item>
                    <Typography color={color} component="h5" variant="h5">
                      {coin.name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color={color} align="right" component="h6" variant="h6">
                      {price ? formatPrice(price) : '...'}
                      <span style={{ fontSize: '10px' }}>$</span>
                    </Typography>
                  </Grid>
                </Grid>
              </React.Fragment>
            }
            secondary={
              <Grid container alignItems="center" justify="space-between">
                <Grid item>
                  <span style={{ fontSize: '10px', color: 'white' }}>{coin.symbol}</span>
                </Grid>
                <Grid item>
                  <Typography align="right" variant="body2" color={priceChange && priceChange >= 0 ? 'primary' : 'secondary'}>
                    {priceChange && priceChange>0 ? '+':''}{priceChange ? formatPrice(priceChange) : '...'}%
                  </Typography>
                </Grid>
              </Grid>
            }
          />
          <ListItemSecondaryAction>
            <IconButton aria-label="Favorite" disabled={howManyFavorites === 1 && isFavorite} onClick={() => markAsFavorite(coin.id)}>
              {isFavorite && <StarIcon />}
              {!isFavorite && <StarBorderIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    }

    return null;
  }
}

export default Coin;
