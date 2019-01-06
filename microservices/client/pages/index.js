/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import io from 'socket.io-client';
import { withStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import Coin from '../components/coin/Coin';
const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

class Index extends React.Component {
  state = { coins: {}, symbol: 'ETHUSDT', exchange:'binance' };
  constructor() {
    super();
    this.socket = io('localhost:4500', { forceNew: true });
  }
  assignCoinProperties = (data) => {
    
  }
  componentDidMount() {
    const { coins, exchange, symbol } = this.state;
    
    this.socket.on(`${exchange}_${symbol}`, (data) => {
      if (!coins[this.state.symbol]) {
        coins[symbol] = {
          price: 0,
          pricesList: [],
          priceChange24hr: 0,
          volumeDifference: 0,
          tendency: '',
          buyOrder: {},
          sellOrder: {}
        };
      }
      const { type } = data;
      switch (type) {
        case 'volume_difference':
          if (!coins[symbol].volumeDifference ||
            Math.round(coins[symbol].volumeDifference * 100) / 100 !== Math.round(data.currentVolumeDifference * 100) / 100 ||
            coins[symbol].tendency !== data.tendency) {
            
              coins[symbol].volumeDifference = data.currentVolumeDifference;
              coins[symbol].tendency = data.tendency;
              this.setState({ coins });
          }
          break;
        case 'latest_price':
          if (coins[symbol].price !== data.price) {
            coins[symbol].price = data.price;
            this.setState({ coins });
          }
          break;
        case 'price_change_24hr':
          const valueHasChanged = Math.round(coins[symbol].priceChange24hr * 10) / 10 !== Math.round(parseFloat(data.price) * 10) / 10;
          if (valueHasChanged) {
            coins[symbol].priceChange24hr = parseFloat(data.price);
            this.setState({ coins });
          }

          break;
        // case 'price_list':
        //   coins[symbol].pricesList = data.prices.slice(400, data.prices.length -1);
        //   break;
        case 'order':
          const { details } = data;
          if (details.type === 'buy') {
            coins[symbol].buyOrder = details;
          } else {
            coins[symbol].sellOrder = details;
          }
          this.setState({ coins });
          break;
        default:
          break;
      }
    });
  }

  render() {
    const stateSymbols = Object.keys(this.state.coins);
    return (
      <Layout>
        <div>
          <h1>Welcome to Rémora!</h1>
          {stateSymbols.map((coinSymbol) => {
            const { price, pricesList, priceChange24hr, volumeDifference , tendency} = this.state.coins[coinSymbol];
            return <Coin key={`${coinSymbol}_${Math.random()}`}
              symbol={coinSymbol}
              price={price}
              priceChange24hr={priceChange24hr}
              pricesList={pricesList}
              volumeDifference={volumeDifference}
              tendency={tendency}
            />
          })}
        </div>
      </Layout>
    );
  }
}

export default withStyles(styles)(Index);
