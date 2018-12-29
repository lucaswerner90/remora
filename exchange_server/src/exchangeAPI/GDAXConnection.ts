import * as GDAX from 'gdax';
import Coin from '../coin/Coin';
import { TCoinProperties } from '../commonTypes';
import ExchangeConnection from './ExchangeConnection';

// Load the coins config
const USD_COINS = require('../../config/exchanges/gdax/coins_usd.json');

/**
 * Connection to the GDAX exchange
 *
 * @export
 * @class GDAXConnection
 * @extends {ExchangeConnection}
 */
export default class GDAXConnection extends ExchangeConnection{

  /**
   *
   * different times that could be used within the intervals/websockets
   * @private
   * @static
   * @memberof GDAXConnection
   */
  private static TIMES = {
    '1MIN': 60,
    '5MIN': 300,
    '15MIN': 900,
    '1HOUR': 3600,
    '6HOURS': 21600,
    '1DAY': 86400,
  };

  /**
   *
   * Client connection to the GDAX API
   * @private
   * @type {GDAX.PublicClient}
   * @memberof GDAXConnection
   */
  private exchangeAPIClient: GDAX.PublicClient;

  constructor(mainCoin: string = 'USD') {
    super(mainCoin, 'GDAX');
  }

  /**
   *
   * Initializes the GDAX configuration
   * @memberof GDAXConnection
   */
  config() {
    this.exchangeAPIClient = new GDAX.PublicClient();
  }
  /**
   *
   * Return the coins that are going to be used by the server instance from the JSON file
   * @param {string} mainCoin
   * @returns
   * @memberof GDAXConnection
   */
  getCoins(mainCoin: string): TCoinProperties[] {
    switch (mainCoin) {
      case 'USD':
        return USD_COINS;
      default:
        break;
    }
  }

  /**
   *
   *
   * @private
   * @param {string} coin
   * @memberof GDAXConnection
   */
  createCoinWebSockets(coin: Coin) {
    const updateTime: number = 6 * 1000;
    this.createPricesListInterval(coin, updateTime * 5);
    this.createOrderBookInterval(coin, updateTime);
    this.createPriceChangeInterval(coin, updateTime * 5);
  }

  private createPriceChangeInterval(coin: Coin, updateTime: number): any {
    return setInterval(() => {
      this.exchangeAPIClient.getProductHistoricRates(coin.symbol, { granularity: GDAXConnection.TIMES['1DAY'] }, (error, response, data) => {
        if (data && data.length && coin.actualPrice) {
          const open = parseFloat(data[0][3]);
          let difference = 0;
          if (open > coin.actualPrice) {
            difference = (Math.abs(open - coin.actualPrice) / coin.actualPrice) * 100;
          } else {
            difference = (Math.abs(open - coin.actualPrice) / coin.actualPrice) * -100;
          }
          difference = Math.round(difference * 100) / 100;
          coin.priceChange24hr = difference;
        }
      });
    }, updateTime);
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
  createPricesListInterval(coin: Coin, updateTime: number) {
    const chartPriceConfig = { granularity: GDAXConnection.TIMES['5MIN'] };
    // Gets the last chart price of the coin
    return setInterval(() => {
      this.exchangeAPIClient.getProductHistoricRates(coin.symbol, chartPriceConfig, (error, response, data) => {
        if (data && data.length) {
          const actualPrice = parseFloat(data[0][4]);
          if (isFinite(actualPrice) && !isNaN(actualPrice)) {
            coin.actualPrice = parseFloat(data[0][4]);
            const historicalDate = data.slice(1).reverse();
            // Create the price list
            const newPrices = historicalDate.map(chartTick => chartTick[4]);
            coin.pricesList = newPrices;
          }
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
  createOrderBookInterval(coin: Coin, updateTime: number) {
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

}
