import * as GDAX from 'gdax';
import Coin from '../coin/Coin';

// Load the coins config
const USD_COINS = require('../../config/exchanges/gdax/coins_usd.json');

interface ICoinsArray {
  [propName: string]: Coin;
}

interface ICoinProperties {
  name: string;
  alarm: number;
  against: string;
  volumeDifference: number;
}

export default class GDAXConnection {

  private coinsArray: ICoinsArray = {};
  private exchangeAPIClient = new GDAX.PublicClient();
  private mainCoin: string = 'USD';
  private _coinsList: ICoinProperties[];

  constructor(mainCoin: string = 'USD') {
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
   * @memberof GDAXConnection
   */
  private createCoinConfiguration(coin: string = '', coinProperties: ICoinProperties) {
    this.coinsArray[coin] = new Coin(coin, coinProperties, 'gdax');
    this.createCoinWebSockets(this.coinsArray[coin]);
    this.createCoinIntervals(this.coinsArray[coin]);
  }
  /**
   *
   * Return the coins that are going to be used by the server instances
   * @param {string} mainCoin
   * @returns
   * @memberof GDAXConnection
   */
  private getCoins(mainCoin: string): ICoinProperties[] {
    switch (mainCoin) {
      case 'USD':
        return USD_COINS;
      default:
        break;
    }
  }

  private createCoinIntervals(coin: Coin) {
    const updateTime: number = 20 * 1000;
    return setInterval(() => {
      if (coin.actualPrice) {
        coin.calculateVolumeDifference();
      }
    }, updateTime);
  }

  /**
   *
   *
   * @private
   * @param {string} coin
   * @memberof GDAXConnection
   */
  private createCoinWebSockets(coin: Coin) {
    const updateTime: number = 5 * 1000;
    this.createPricesListInterval(coin, updateTime);
    this.createOrderBookInterval(coin, updateTime);
  }

  /**
   *
   * Example of response from getProductHistoricRates
      [
          [ time, low, high, open, close, volume ],
          [ 1415398768, 0.32, 4.2, 0.35, 4.2, 12.3 ],
          ...
      ]
   * @private
   * @param {string} coin
   * @param {number} updateTime
   * @returns
   * @memberof GDAXConnection
   */
  private createPricesListInterval(coin: Coin, updateTime: number) {
    const chartPriceConfig = { granularity: GDAXConnection.TIMES['5MIN'] };
    // Gets the last chart price of the coin
    return setInterval(() => {
      this.exchangeAPIClient.getProductHistoricRates(coin.symbol, chartPriceConfig, (error, response, data) => {
        if (data && data.length) {
          coin.actualPrice = parseFloat(data[0][4]);
          const historicalDate = data.slice(1).reverse();
          // Create the price list
          const newPrices = historicalDate.map(chartTick => chartTick[4]);
          coin.updatePricesList(newPrices);
        }
      });
    }, updateTime);
  }

  /**
  *
  *
  * Get the coin orders.
  *
  * We need to send two objects:
  * - One contains the sell orders
  * - The other contains the buy orders
  *
  * The key for those objects NEEDS to be a number that indicates the price of the order
  * The value MUST be the quantity of the COIN that belongs to the order
  *
  * Example:
  *  This is an order that says: At price 7000 I want to sell 30 coins.
  *  sellOrders[7000] = 30
  *
  *  The amount involved in that order is calculated that way: 7000 * 30 ---> 210.000 (WHALE ORDER)
  * @private
  * @param {string} coin
  * @param {number} updateTime
  * @returns
  * @memberof GDAXConnection
  */
  private createOrderBookInterval(coin: Coin, updateTime: number) {
    const orderBookConfig = { level: 2 };
    return setInterval(() => {
      this.exchangeAPIClient.getProductOrderBook(coin.symbol, orderBookConfig, (error, response, data) => {
        if (data) {
          const buyOrders = {};
          const sellOrders = {};

          const { asks, bids } = data;
          for (let i = 0; i < asks.length; i++) {
            const price = parseFloat(asks[i][0]);
            const size = parseFloat(asks[i][1]);
            sellOrders[price] = size;
          }
          for (let i = 0; i < bids.length; i++) {
            const price = parseFloat(bids[i][0]);
            const size = parseFloat(bids[i][1]);
            buyOrders[price] = size;
          }
          if (Object.keys(buyOrders).length && Object.keys(sellOrders).length) {
            coin.updateOrders({ sellOrders, buyOrders });
          }
        }
      });
    }, updateTime);
  }

  static get TIMES() {
    return {
      '1MIN': 60,
      '5MIN': 300,
      '15MIN': 900,
      '1HOUR': 3600,
      '6HOURS': 21600,
      '1DAY': 86400,
    };
  }

}
