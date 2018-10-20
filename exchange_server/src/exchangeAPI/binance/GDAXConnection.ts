import * as GDAX from 'gdax';
import Coin from '../../coin/Coin';

// Load the coins config
const USD_COINS = require('../../../config/exchanges/gdax/coins_usd.json');

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

  private COINS_ARRAY: ICoinsArray = {};
  private static GDAXClient = new GDAX.PublicClient();
  private static MAIN_COIN: string = 'USDT';
  constructor(mainCoin: string = 'USDT') {

    GDAXConnection.MAIN_COIN = mainCoin;
    // Get the specific coins for the server instance
    const listOfCoins = this.getCoins(GDAXConnection.MAIN_COIN);

    // Once we have the coins for the instance we need to initialize both the coin object and the websockets associated to it
    Object.keys(listOfCoins).forEach((coin: string) => {
      this.createCoinConfiguration(coin);
    });

  }
  /**
   *
   * Init the coin configuration. Open websockets, add it to COINS_ARRAY.
   *
   * @private
   * @param {string} [coin=""]
   * @memberof GDAXConnection
   */
  private createCoinConfiguration(coin: string = '') {
    const coinProperties: ICoinProperties = this.getCoins(GDAXConnection.MAIN_COIN)[coin];
    const coinURL = `https://pro.coinbase.com/trade/${coinProperties.name}-${coinProperties.against}`;

    this.COINS_ARRAY[coin] = new Coin(coinProperties.name, coin, coinURL, coinProperties.alarm, coinProperties.against, coinProperties.volumeDifference, 'gdax');
    this.createWebSockets(coin);
    this.createIntervals(coin);
  }
  /**
   *
   * Return the coins that are going to be used by the server instances
   * @param {string} mainCoin
   * @returns
   * @memberof GDAXConnection
   */
  public getCoins(mainCoin: string) {
    switch (mainCoin) {
      case 'USD':
        return USD_COINS;
      default:
        break;
    }
  }

  private createIntervals(coin: string) {
    // Every 10sec we call the volume difference function to calculate posible differences between bids/asks
    const updateTime: number = 20 * 1000;
    setInterval(() => {
      if (this.COINS_ARRAY[coin].actualPrice) {
        this.COINS_ARRAY[coin].calculateVolumeDifference();
      }
    }, updateTime);
  }

  private createWebSockets(coin: string) {
    // Gets the last chart price of the coin
    setInterval(() => {
      /**
       * Example of response from getProductHistoricRates
       *
       *  [
              [ time, low, high, open, close, volume ],
              [ 1415398768, 0.32, 4.2, 0.35, 4.2, 12.3 ],
              ...
          ]
       *
      */
      GDAXConnection.GDAXClient.getProductHistoricRates(coin, { granularity: GDAXConnection.TIMES['5MIN'] }, (error, response, data) => {
        if (data && data.length) {
          this.COINS_ARRAY[coin].actualPrice = parseFloat(data[0][4]);
          const historicalDate = data.slice(1).reverse();

          // Create the price list
          // tslint:disable-next-line:ter-arrow-parens
          const newPrices = historicalDate.map((chartTick) => chartTick[4]);
          this.COINS_ARRAY[coin].updatePricesList(newPrices);
        }
      });
    }, 20 * 1000);

    /**
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
     * */
    setInterval(() => {
      GDAXConnection.GDAXClient.getProductOrderBook(coin, { level: 2 }, (error, response, data) => {
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
            this.COINS_ARRAY[coin].updateOrders({ sellOrders, buyOrders });
          }
        }
      });
    }, 3000);

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
