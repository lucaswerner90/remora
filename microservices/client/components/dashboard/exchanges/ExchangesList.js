import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import CoinSocketComponent from '../../common/CoinSocketComponent';

const styles = theme => ({
  root: {
    flexGrow:1
  },
});
const renderList = (coinsArray = [], tileSize = 3, { showExchange = false, isFavorite = false }) => {
  return coinsArray.map(coin =>
    <CoinSocketComponent key={`${coin.id}_${Math.random()}`}
      coin={coin}
      tileSize={tileSize}
      showExchange={showExchange}
      isFavorite={isFavorite}
    />
  );
}
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
            name: 'Bitcoin',
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
            {renderList(exchange.coins, 3, {showExchange: false, isFavorite: false})}
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
