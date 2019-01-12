import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import coinRender from '../common/CoinRender';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
});


export class FavoritesList extends Component {
  state = {
    favorites: [
      {
        id: 'ETHUSDT',
        name: 'Ethereum',
        against: '$',
        coinSymbol: 'ETH',
        url: 'https://binance.com/en/trade/pro/ETH_USDT',
        exchange: 'binance'
      },
      {
        id: 'LTCUSDT',
        name: 'Litecoin',
        against: '$',
        coinSymbol: 'LTC',
        url: 'https://binance.com/en/trade/pro/LTC_USDT',
        exchange: 'binance'
      },
    ],
  };
  render() {
    const { classes } = this.props;
    const { favorites } = this.state;
    return (
      <Grid container className={classes.root} spacing={24}>
        <Grid item xs={12}>
          <Typography variant="h4">
            <strong>Favorites</strong>
          </Typography>
        </Grid>
        {coinRender(favorites, 4, { showExchange: true })}
      </Grid>
    )
  }
}

export default withStyles(styles)(FavoritesList);
