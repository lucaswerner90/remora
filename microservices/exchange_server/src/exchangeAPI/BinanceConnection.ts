import * as Binance from 'node-binance-api';
import Coin from '../coin/Coin';
import ExchangeConnection from './ExchangeConnection';

// Load the coins config
const ETH_COINS = require('../../config/exchanges/binance/coins_eth.json');
const USD_COINS = require('../../config/exchanges/binance/coins_usdt.json');

export default class BinanceConnection extends ExchangeConnection{

  private static NUM_NEAR_ORDERS: number = parseInt(process.env.NEAR_ORDERS) || 50;
  private static SECRET_KEY = 'oSi2NTurIlSqQWEkr7MeMqvumQi4KEzijjXrEkVGaTxqiYsahLn7PErasmj4JT9D';
  private static API_KEY = 'dEz6IcC8Dkb50ruvZOoLaQg8X7PWGfJXVpoSXseAOuBDweuyWwQr5ttq51gANKjn';
  private static TIMES = {
    DAY: '1d',
    HOUR: {
      '12HOUR': '1h',
      '1HOUR': '1h',
      '2HOUR': '1h',
      '4HOUR': '1h',
      '6HOUR': '1h',
    },
    MIN: {
      '15MIN': '15m',
      '1MIN': '1m',
      '5MIN': '5m',
    },
    WEEK: '1w',
  };
  constructor(mainCoin: string = 'USD') {
    super(mainCoin, 'binance');
  }

  /**
   *
   * Return the coins that are going to be used by the server instances
   * @param {string} mainCoin
   * @returns
   * @memberof BinanceConnection
   */
  getCoins(mainCoin: string) {
    switch (mainCoin) {
      case 'USD':
        return USD_COINS;
      case 'ETH':
        return ETH_COINS;
      default:
        break;
    }
  }

  createCoinWebSockets(coin: Coin) {
    // Gets the last chart price of the coin
    Binance.websockets.chart(coin.symbol, BinanceConnection.TIMES.MIN['1MIN'], (symbol: string, interval: any, chart: { [x: string]: any; }) => {
      const tick = Binance.last(chart);
      if (tick && chart[tick] && chart[tick].close) {
        const last = chart[tick].close;
        coin.actualPrice = parseFloat(last);
        // Update coin prices.
        const newPrices = [];
        Object.keys(chart).forEach((tick, i) => {
          const chartTick = chart[tick];
          const price = parseFloat(chartTick.close);
          const time = Date.now() - ((i + 1) * 60 * 1000);
          newPrices.push([time, price]);
        });

        if (newPrices.length) {
          coin.pricesList1min = newPrices;
        }
      }

    });
    Binance.websockets.chart(coin.symbol, BinanceConnection.TIMES.MIN['5MIN'], (symbol: string, interval: any, chart: { [x: string]: any; }) => {
      const tick = Binance.last(chart);
      if (tick && chart[tick] && chart[tick].close) {
        const newPrices = [];
        Object.keys(chart).forEach((tick, i) => {
          const chartTick = chart[tick];
          const price = parseFloat(chartTick.close);
          const time = Date.now() - ((i + 1) * 5 * 60 * 1000);
          newPrices.push([time, price]);
        });

        if (newPrices.length) {
          coin.pricesList5min = newPrices;
        }
      }

    });
    Binance.websockets.chart(coin.symbol, BinanceConnection.TIMES.MIN['15MIN'], (symbol: string, interval: any, chart: { [x: string]: any; }) => {
      const tick = Binance.last(chart);
      if (tick && chart[tick] && chart[tick].close) {
        // Update coin prices.
        const newPrices = [];
        Object.keys(chart).forEach((tick, i) => {
          const chartTick = chart[tick];
          const price = parseFloat(chartTick.close);
          const time = Date.now() - ((i + 1) * 15 * 60 * 1000);
          newPrices.push([time, price]);
        });

        if (newPrices.length) {
          coin.pricesList15min = newPrices;
        }
      }

    });

    // Gets the bids/asks for a specific coin
    Binance.websockets.depthCache([coin.symbol], (coinName: string, depth: { bids: any, asks: any }) => {
      const buyOrders = Binance.sortBids(depth.bids, BinanceConnection.NUM_NEAR_ORDERS);
      const sellOrders = Binance.sortAsks(depth.asks, BinanceConnection.NUM_NEAR_ORDERS);

      const parsedBuyOrders = {};
      const parsedSellOrders = {};

      Object.keys(buyOrders).map(key => parsedBuyOrders[parseFloat(key)] = buyOrders[key]);
      Object.keys(sellOrders).map(key => parsedSellOrders[parseFloat(key)] = sellOrders[key]);
      this.coinsArray[coinName].updateOrders(parsedSellOrders, parsedBuyOrders);
    });

    Binance.websockets.prevDay([coin.symbol], (error: any, { percentChange }) => {
      coin.priceChange24hr = percentChange;
    });

  }

  config() {
    Binance.options({ APIKEY: BinanceConnection.API_KEY, APISECRET: BinanceConnection.SECRET_KEY, reconnect: true, useServerTime: false });
  }
}
