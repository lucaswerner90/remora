import * as Binance from 'node-binance-api';
import Coin from '../coin/Coin';
import ExchangeConnection from './ExchangeConnection';

// Load the coins config
const ETH_COINS = require('../../config/exchanges/binance/coins_eth.json');
const USD_COINS = require('../../config/exchanges/binance/coins_usdt.json');

export default class BinanceConnection extends ExchangeConnection{

  private static NUM_NEAR_ORDERS: number = parseInt(process.env.NEAR_ORDERS) || 100;
  private static SECRET_KEY = 'oSi2NTurIlSqQWEkr7MeMqvumQi4KEzijjXrEkVGaTxqiYsahLn7PErasmj4JT9D';
  private static API_KEY = 'dEz6IcC8Dkb50ruvZOoLaQg8X7PWGfJXVpoSXseAOuBDweuyWwQr5ttq51gANKjn';
  private static TIMES = {
    DAY: '1d',
    HOUR: {
      '12HOUR': '12h',
      '1HOUR': '1h',
      '2HOUR': '2h',
      '4HOUR': '4h',
      '6HOUR': '6h',
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
  /**
   *
   * This method returns the data suitable for the client chart, so it includes both the timestamp and the price value for each one.
   * @param {*} chart
   * @returns
   * @memberof BinanceConnection
   */
  createPricesList(chart) {
    const prices = [];
    Object.keys(chart).forEach((tick, _i) => {
      const chartTick = chart[tick];
      const price = parseFloat(chartTick.close);
      prices.push([parseFloat(tick), price]);
    });
    return prices;
  }
  createArraysFromChartArray(chart: { [x: string]: any; } = {}) {
    const pricesTimeStamp = [];
    const prices = [];
    const volumes = [];
    Object.keys(chart).forEach((tick, _i) => {
      const chartTick = chart[tick];
      const price = parseFloat(chartTick.close);
      pricesTimeStamp.push([parseFloat(tick), price]);
      prices.push(price);
      volumes.push(parseFloat(chartTick.volume));
    });
    return { pricesTimeStamp, prices, volumes };
  }
  createCoinWebSockets(coin: Coin) {
    // Gets the updated coin chart
    coin.webSockets.price['1MIN'] = Binance.websockets.chart(coin.symbol, BinanceConnection.TIMES.MIN['1MIN'], (_symbol: string, _interval: any, chart: { [x: string]: any; }) => {
      const tick = Binance.last(chart);
      if (tick && chart[tick] && chart[tick].close) {

        // Update current coin price
        const last = chart[tick].close;
        coin.actualPrice = parseFloat(last);

        // Parse the chart information and assign the values to its own variables
        const { pricesTimeStamp, prices, volumes } = this.createArraysFromChartArray(chart);
        if (prices.length) {
          coin.pricesList1min = pricesTimeStamp;
          coin.MACD = prices;
          coin.calculateVolumeDifference(volumes, parseFloat(chart[tick].volume));
        }
      }

    });
    coin.webSockets.price['5MIN'] = Binance.websockets.chart(coin.symbol, BinanceConnection.TIMES.MIN['5MIN'], (_symbol: string, _interval: any, chart: { [x: string]: any; }) => {
      const tick = Binance.last(chart);
      if (tick && chart[tick] && chart[tick].close) {

        // Update coin prices.
        const prices = this.createPricesList(chart);

        if (prices.length) {
          coin.pricesList5min = prices;
        }
      }
    });
    coin.webSockets.price['15MIN'] = Binance.websockets.chart(coin.symbol, BinanceConnection.TIMES.MIN['15MIN'], (_symbol: string, _interval: any, chart: { [x: string]: any; }) => {
      const tick = Binance.last(chart);
      if (tick && chart[tick] && chart[tick].close) {

        // Update coin prices.
        const prices = this.createPricesList(chart);

        if (prices.length) {
          coin.pricesList15min = prices;
        }
      }
    });
    coin.webSockets.price['1HOUR'] = Binance.websockets.chart(coin.symbol, BinanceConnection.TIMES.HOUR['1HOUR'], (_symbol: string, _interval: any, chart: { [x: string]: any; }) => {
      const tick = Binance.last(chart);
      if (tick && chart[tick] && chart[tick].close) {
        // Update coin prices.
        const prices = this.createPricesList(chart);
        if (prices.length) {
          coin.pricesList1hour = prices;
        }
      }

    });
    coin.webSockets.price['2HOUR'] = Binance.websockets.chart(coin.symbol, BinanceConnection.TIMES.HOUR['2HOUR'], (_symbol: string, _interval: any, chart: { [x: string]: any; }) => {
      const tick = Binance.last(chart);
      if (tick && chart[tick] && chart[tick].close) {
        // Update coin prices.
        const prices = this.createPricesList(chart);
        if (prices.length) {
          coin.pricesList2hour = prices;
        }
      }
    });

    // Gets the bids/asks for a specific coin
    coin.webSockets.orders = Binance.websockets.depthCache([coin.symbol], (coinName: string, depth: { bids: any, asks: any }) => {
      const buyOrders = Binance.sortBids(depth.bids, BinanceConnection.NUM_NEAR_ORDERS);
      const sellOrders = Binance.sortAsks(depth.asks, BinanceConnection.NUM_NEAR_ORDERS);

      const parsedBuyOrders = {};
      const parsedSellOrders = {};

      Object.keys(buyOrders).map(key => parsedBuyOrders[parseFloat(key)] = buyOrders[key]);
      Object.keys(sellOrders).map(key => parsedSellOrders[parseFloat(key)] = sellOrders[key]);
      this.coinsArray[coinName].updateOrders(parsedSellOrders, parsedBuyOrders);
    });

    coin.webSockets.previousDay = Binance.websockets.prevDay([coin.symbol], (_error: any, { percentChange }) => {
      coin.priceChange24hr = percentChange;
    });

  }

  config() {
    Binance.options({ APIKEY: BinanceConnection.API_KEY, APISECRET: BinanceConnection.SECRET_KEY, reconnect: true, useServerTime: false });
  }
}
