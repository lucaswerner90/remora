import React, { Component } from 'react';

import { connect } from 'react-redux';
import { createPost } from '../../../redux/actions/userPreferencesActions';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import CoinSocketComponent from '../../common/CoinSocketComponent';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
});

const renderList = (coinsArray = [], tileSize = 3, {showExchange = false}) => {
  return coinsArray.map(coin =>
    <CoinSocketComponent key={coin.id} coin={coin} tileSize={tileSize} showExchange={showExchange} isFavorite={true}/>
  );
}
export class FavoritesList extends Component {
  state = {
    favorites: [
      {
        id: 'ETHUSDT',
        name: 'Ethereum',
        against: '$',
        isFavorite: true,
        coinSymbol: 'ETH',
        url: 'https://binance.com/en/trade/pro/ETH_USDT',
        exchange: 'binance'
      },
      {
        id: 'LTCUSDT',
        name: 'Litecoin',
        isFavorite: true,against: '$',
        coinSymbol: 'LTC',
        url: 'https://binance.com/en/trade/pro/LTC_USDT',
        exchange: 'binance'
      },
      // {
      //   id: 'XRPUSDT',
      //   name: 'Ripple',
      //   against: '$',
      //   coinSymbol: 'XRP',
      //   url: 'https://binance.com/en/trade/pro/BTC_USDT',
      //   exchange: 'binance'
      // },
    ],
  };
  render() {
    const { classes } = this.props;
    const { favorites } = this.state;
    // const post = {
    //   title: this.state.title,
    //   body: this.state.body
    // };
    // this.props.createPost(post);
    const header = (
      <Grid item xs={12}>
        <Typography variant="h4">
          <strong>Favorites</strong>
        </Typography>
      </Grid>

    );
    let tileSize = 12;
    switch (favorites.length) {
      case 1:
        tileSize = 12;
        break;
      case 2:
        tileSize = 6;
        break;
    
      case 3:
        tileSize = 4;
        break;
    
      default:
        break;
    }
    return (
      <Grid container className={classes.root} spacing={24}>
        {header}
        <Grid item xs={12}>
          <Grid container className={classes.root} spacing={24}>
            {renderList(favorites, tileSize, { showExchange: true, isFavorite: true })}
          </Grid>
        </Grid>
        
      </Grid>
    )
  }
}

export default connect(null, { createPost })(withStyles(styles)(FavoritesList));
