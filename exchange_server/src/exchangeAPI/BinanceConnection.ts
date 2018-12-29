import * as Binance from 'node-binance-api';
import Coin from '../coin/Coin';

// Load the coins config
const ETH_COINS = require('../../config/exchanges/binance/coins_eth.json');
const USD_COINS = require('../../config/exchanges/binance/coins_usdt.json');

interface ICoinsArray {
  [propName: string]: Coin;
}

interface ICoinProperties {
  name: string;
  alarm: number;
  against: string;
  volumeDifference: number;
}

export default class BinanceConnection {

  private coinsArray: ICoinsArray = {};
  private static NUM_NEAR_ORDERS: number = 200;
  private mainCoin: string = 'USD';
  private _coinsList: ICoinProperties[];

  constructor(mainCoin: string = 'USD') {

    // Init the common behaviour for every binance server
    this.config();

    this.mainCoin = mainCoin;
    // Get the specific coins for the server instance
    this.coinsList = this.getCoins(this.mainCoin);
  }

  private set coinsList(newValue: ICoinProperties[]) {
    this._coinsList = newValue;
    // Once we have the coins for the instance we need to initialize both the coin object and the websockets associated to it
    Object.keys(this._coinsList).forEach((coin: string) => {
      this.createCoinConfiguration(coin, this._coinsList[coin]);
    });
  }
  /**
   *
   * Init the coin configuration. Open websockets, add it to coinsArray.
   *
   * @private
   * @param {string} [coin=""]
   * @memberof BinanceConnection
   */
  private createCoinConfiguration(coin:string= '', coinProperties: ICoinProperties) {
    this.coinsArray[coin] = new Coin(coin, coinProperties, 'binance');
    this.createWebSockets(this.coinsArray[coin]);
    this.createIntervals(this.coinsArray[coin]);
  }

  /**
   *
   * Return the coins that are going to be used by the server instances
   * @param {string} mainCoin
   * @returns
   * @memberof BinanceConnection
   */
  private getCoins(mainCoin: string) {
    switch (mainCoin) {
      case 'USD':
        return USD_COINS;
      case 'ETH':
        return ETH_COINS;
      default:
        break;
    }
  }

  private createIntervals(coin: Coin) {
    // Every 10sec we call the volume difference function to calculate posible differences between bids/asks
    const updateTime: number = 20 * 1000;
    setInterval(() => {
      if (coin.actualPrice) {
        coin.calculateVolumeDifference();
        this.refreshTable();
      }
    }, updateTime);
  }
  private refreshTable() {
    const volumeDifferenceTableData = Object.keys(this.coinsArray)
            .filter(coinName => this.coinsArray[coinName].existsVolumeDifference)
            .map(coinName => this.coinsArray[coinName].getVolumeProperties());
    const orderBuyTableData = Object.keys(this.coinsArray)
            .filter(coinName => this.coinsArray[coinName].containsBuyOrders())
            .map(coinName => this.coinsArray[coinName].getOrdersProperties('buy'));
    const orderSellTableData = Object.keys(this.coinsArray)
            .filter(coinName => this.coinsArray[coinName].containsSellOrders())
            .map(coinName => this.coinsArray[coinName].getOrdersProperties('sell'));
    console.clear();
    console.log('');
    console.log('Binance Volume Difference Table Data');
    console.table(volumeDifferenceTableData);
    console.log('Binance Coin Buy Orders Table Data');
    console.table(orderBuyTableData);
    console.log('Binance Coin Sell Orders Table Data');
    console.table(orderSellTableData);
  }

  private createWebSockets(coin: Coin) {
        // Gets the last chart price of the coin
    Binance.websockets.chart(coin.symbol, BinanceConnection.TIMES.MIN['15MIN'], (symbol, interval, chart) => {
      const tick = Binance.last(chart);
      const last = chart[tick].close;
      coin.actualPrice = parseFloat(last);

      // Update coin prices.
      const newPrices = [];
      Object.keys(chart).forEach((tick) => {
        const chartTick = chart[tick];
        const price = parseFloat(chartTick.close);
        newPrices.push(price);
      });

      if (newPrices.length) {
        coin.updatePricesList(newPrices);
      }

    });

        // Gets the bids/asks for a specific coin
    Binance.websockets.depthCache([coin.symbol], (coinName: string, depth: { bids: any, asks: any }) => {
      const buyOrders = Binance.sortBids(depth.bids, BinanceConnection.NUM_NEAR_ORDERS);
      const sellOrders = Binance.sortAsks(depth.asks, BinanceConnection.NUM_NEAR_ORDERS);
      this.coinsArray[coinName].updateOrders({ sellOrders, buyOrders });
    });

  }

  private config() {
    Binance.options({ APIKEY: BinanceConnection.API_KEY, APISECRET: BinanceConnection.SECRET_KEY, reconnect: true, useServerTime: true });
  }

  static get API_KEY() {
    return 'dEz6IcC8Dkb50ruvZOoLaQg8X7PWGfJXVpoSXseAOuBDweuyWwQr5ttq51gANKjn';
  }

  static get SECRET_KEY() {
    return 'oSi2NTurIlSqQWEkr7MeMqvumQi4KEzijjXrEkVGaTxqiYsahLn7PErasmj4JT9D';
  }

  static get TIMES() {
    return {
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
  }
}
