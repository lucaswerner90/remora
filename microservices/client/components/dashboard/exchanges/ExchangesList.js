import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardContent } from '@material-ui/core';
import coinRender from '../common/CoinRender';

const styles = theme => ({
  root: {
    flexGrow:1
  },
});

export class ExchangesList extends Component {
  state = {
    exchanges: {
      binance: {
        name: 'Binance',
        against: '$',
        url: 'https://binance.com',
        coins: [
          {
            id: 'ETHUSDT',
            coinSymbol: 'ETH',
            name: 'Ethereum',
            against: '$',
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
          {
            id: 'BTCUSDT',
            name: 'Bitecoin',
            against: '$',
            coinSymbol: 'BTC',
            url: 'https://binance.com/en/trade/pro/BTC_USDT',
            exchange: 'binance'
          },
          {
            id: 'XRPUSDT',
            name: 'Ripple',
            against: '$',
            coinSymbol: 'XRP',
            url: 'https://binance.com/en/trade/pro/BTC_USDT',
            exchange: 'binance'
          },
        ]
      }
    }
  };
  render() {
    const { classes } = this.props;
    const exchanges = Object.keys(this.state.exchanges);
    const exchangesRender = (exchanges = []) => {
      const mapExchanges = exchanges.map(e => this.state.exchanges[e]);
      return mapExchanges.map(exchange =>
        <Grid item key={exchange.name} xs={12}>
          <Grid container className={classes.root} spacing={8}>
            <Grid item xs={12}>
              <Typography variant="h6">
                <strong>{exchange.name.toUpperCase()}</strong>
              </Typography>
            </Grid>
            {coinRender(exchange.coins, 3, {showExchange: false})}
          </Grid>
        </Grid>

      );
    };
    return (
      <Grid container className={classes.root} spacing={24}>
        {exchangesRender(exchanges)}
      </Grid>
    )
  }
}

export default withStyles(styles)(ExchangesList);
