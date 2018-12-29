import Order from './Order';
import RedisClient from '../redis/RedisClient';
interface IRawCoinWhaleOrder {
  [index: number]: number;
}
interface ICoinWhaleOrder {
  [index: string]: Order;
}
const redis: RedisClient = new RedisClient();
export default class Coin {
  public actualPrice: number = 0;
  public symbol: string;
  private against: string;
  private whaleBuyOrders: ICoinWhaleOrder;
  private whaleSellOrders: ICoinWhaleOrder;
  private currentVolumeDifference: number = 0;
  private exchange: string;
  private alarm: number;
  private volumeDifference: number;
  private lastBuyVolume: number = 0;
  private lastSellVolume: number = 0;
  private orderTendency: string;
  private nearPositionBuy: number;
  private nearPositionSell: number;
  public redisKeys: {
    NEAR_BUY_ORDER: string,
    NEAR_SELL_ORDER: string,
    PRICES_LIST: string,
    VOLUME_DIFFERENCE: string,
    LATEST_PRICE: string,
  };
  public pricesList: any = { prices: [], time: [] };
  public existsVolumeDifference: boolean;

  constructor(symbol: string = '', { alarm = 0, volumeDifference = 0 , against = 'USD' }, exchange: string = '') {
    this.symbol = symbol;
    this.against = against;
    this.alarm = alarm;
    this.exchange = exchange;
    this.volumeDifference = volumeDifference;
    this.whaleBuyOrders = {};
    this.whaleSellOrders = {};

    this.redisKeys = {
      NEAR_BUY_ORDER: `${this.exchange}_${this.symbol}${this.against}_buy_near_order`,
      NEAR_SELL_ORDER: `${this.exchange}_${this.symbol}${this.against}_sell_near_order`,
      PRICES_LIST: `${this.exchange}_${this.symbol}${this.against}_prices_list`,
      LATEST_PRICE: `${this.exchange}_${this.symbol}${this.against}_latest_price`,
      VOLUME_DIFFERENCE: `${this.exchange}_${this.symbol}${this.against}_volume_difference`,
    };
  }

  /**
   * Updates the prices list for the coin and updates the Redis key that contains the list
   *
   * @param {[]} {prices}
   * @memberof Coin
   */
  public updatePricesList(prices: number[] = []) {
    this.pricesList = prices;
    // Set the new value for the redis key's last order
    const redisValue = JSON.stringify({ symbol: this.symbol, exchange: this.exchange, prices: this.pricesList });
    redis.setPricesList(this.redisKeys.PRICES_LIST, redisValue);
  }
  /**
   *
   * This method creates and updates the whale coin orders
   * @private
   * @param {string} type
   * @param {*} newOrdersArray
   * @param {ICoinWhaleOrder} whaleOrdersArray
   * @memberof Coin
   */

  private _assignWhaleOrders(type: string, newOrdersArray: any, whaleOrdersArray: ICoinWhaleOrder) {
    let hasBeenModified = false;
    if (newOrdersArray.numOrders > 0) {
      for (const [_price, _properties] of Object.entries(newOrdersArray.orders)) {
        const price: any = _price;
        const properties: any = _properties;

        if (!whaleOrdersArray[price]) {
          // If the order doesn't exist previously, we create a new one.
          whaleOrdersArray[price] = new Order(this.symbol, type, parseFloat(properties.value),
            this.lastSellVolume, properties.position,
            this.lastBuyVolume, this.actualPrice, this.exchange, 0);

          hasBeenModified = true;

        } else {
          // Update the new properties if they are different
          // Right now, we're not interested in the current order position but we could use it in a future
          if (properties.position !== whaleOrdersArray[price].lastPosition) {
            whaleOrdersArray[price].lastPosition = properties.position;
          }
          if (Math.round(properties.value) !== Math.round(whaleOrdersArray[price].quantity)) {
            whaleOrdersArray[price].quantity = Math.round(properties.value);
            hasBeenModified = true;
          }
        }
      }
    }
    return { whaleOrdersArray, hasBeenModified };
  }

  /**
   *
   * This method is the entrypoint to update the orders of the coin.
   * We receive the raw orders and we have to parse those orders, try to get those which could be a "whale" order and parse that
   * order to create the object and communicate that one
   * @param {{sellOrders: IRawCoinWhaleOrder, buyOrders: IRawCoinWhaleOrder}} [values={ sellOrders: {}, buyOrders: {} }]
   * @memberof Coin
   */
  public updateOrders(values: { sellOrders: IRawCoinWhaleOrder, buyOrders: IRawCoinWhaleOrder } = { sellOrders: {}, buyOrders: {} }) {
    let needToUpdateOrders = false;
    // Delete previous whale orders if they just dissapear
    const deletedBuyOrders = this._deleteWhaleOrders(this.whaleBuyOrders, values.buyOrders);
    if (deletedBuyOrders.numOrdersDeleted) {
      needToUpdateOrders = true;
      this.whaleBuyOrders = deletedBuyOrders.whaleOrders;
    }

    const deletedSellOrders = this._deleteWhaleOrders(this.whaleSellOrders, values.sellOrders);
    if (deletedSellOrders.numOrdersDeleted) {
      needToUpdateOrders = true;
      this.whaleSellOrders = deletedSellOrders.whaleOrders;
    }

    // Detect possible whale orders
    const newBuyOrders = this._detectWhaleOrders(values.buyOrders);
    const newSellOrders = this._detectWhaleOrders(values.sellOrders);

    // Assign the coin volume for both buy and sell orders
    this.lastBuyVolume = newBuyOrders.sumVolume;
    this.lastSellVolume = newSellOrders.sumVolume;

    // Define the coin volume tendency
    this.orderTendency = this.lastBuyVolume > this.lastSellVolume ? 'buy' : 'sell';

    if (newBuyOrders.numOrders) {
      // Create/update the whale buy orders
      const assignNewBuyOrders = this._assignWhaleOrders('buy', newBuyOrders, this.whaleBuyOrders);
      if (assignNewBuyOrders.hasBeenModified) {
        needToUpdateOrders = true;
        this.whaleBuyOrders = assignNewBuyOrders.whaleOrdersArray;
      }
    }
    if (newSellOrders.numOrders) {
      // Create/update the whale sell orders
      const assignNewSellOrders = this._assignWhaleOrders('sell', newSellOrders, this.whaleSellOrders);
      if (assignNewSellOrders.hasBeenModified) {
        needToUpdateOrders = true;
        this.whaleSellOrders = assignNewSellOrders.whaleOrdersArray;
      }
    }
    if (needToUpdateOrders) {
      this.updateNearOrders();
    }

  }

  /**
   *
   * Update the orders
   *
   * @private
   * @memberof Coin
   */
  private updateNearOrders() {

    if (this.containsBuyOrders()) {
      this.nearPositionBuy = Math.max(...Object.keys(this.whaleBuyOrders).map(key => parseFloat(key)));
      if (this.whaleBuyOrders[this.nearPositionBuy].toJSON) {
        const redisValue = JSON.stringify(this.getOrdersProperties('buy'));
        redis.setOrderValue(this.redisKeys.NEAR_BUY_ORDER, redisValue);
      }
    }
    if (this.containsSellOrders()) {
      this.nearPositionSell = Math.min(...Object.keys(this.whaleSellOrders).map(key => parseFloat(key)));
      if (this.whaleSellOrders[this.nearPositionSell].toJSON) {
        const redisValue = JSON.stringify(this.getOrdersProperties('sell'));
        redis.setOrderValue(this.redisKeys.NEAR_SELL_ORDER, redisValue);
      }
    }
  }

  /**
   *
   * Detect if there are orders that have lost their quantity so they don't match the conditions to be a whale order anymore
   * @private
   * @param {ICoinWhaleOrder} whaleOrders
   * @param {*} newCoinOrders
   * @memberof Coin
   */
  private _deleteWhaleOrders(whaleOrders: ICoinWhaleOrder, newCoinOrders) {
    let numOrdersDeleted = 0;
    for (const [orderPrice, orderQuantity] of Object.entries(newCoinOrders)) {
      const price: number = parseFloat(orderPrice);
      const coinQuantity: number = parseFloat(orderQuantity.toString());
      const value = price * coinQuantity;
      if (value < this.alarm && whaleOrders[orderPrice]) {
        console.log(`Order DELETED at price ${orderPrice} for ${this.symbol}--> Previous value: ${whaleOrders[orderPrice].quantity} New Value: ${value}`);
        delete whaleOrders[orderPrice];
        numOrdersDeleted++;
      }
    }
    return { whaleOrders, numOrdersDeleted };
  }

  public calculateVolumeDifference() {
    const buyVolume = this.lastBuyVolume;
    const sellVolume = this.lastSellVolume;
    const currentVolumeDifference = Math.abs(Math.round(((buyVolume >= sellVolume ? buyVolume / sellVolume : sellVolume / buyVolume)) * 100) - 100);

    this.existsVolumeDifference = currentVolumeDifference >= this.volumeDifference;

    if (currentVolumeDifference !== this.currentVolumeDifference) {
      this.currentVolumeDifference = currentVolumeDifference;

      const redisValue = JSON.stringify(this.getVolumeProperties());
      redis.setVolumeDifferenceValue(this.redisKeys.VOLUME_DIFFERENCE, redisValue);
    }

    return currentVolumeDifference;
  }

  public _detectWhaleOrders(orders: IRawCoinWhaleOrder = {}): { orders: { [index: number]: { value: number, position: number } }, numOrders: number, sumVolume: number } {
    const whaleOrders = {};
    let numOrders: number = 0;
    let sumVolume: number = 0;
    let position: number = 0;
    for (const [orderPrice, orderQuantity] of Object.entries(orders)) {
      const price: number = parseFloat(orderPrice);
      const coinQuantity: number = parseFloat(orderQuantity);
      const value = price * coinQuantity;
      position++;
      sumVolume += value;
      if (value > this.alarm) {
        whaleOrders[price] = { value, position };
        numOrders++;
      }
    }
    return { numOrders, sumVolume, orders: whaleOrders };
  }

  public getVolumeProperties() {
    return {
      exchange: this.exchange,
      actualPrice: this.actualPrice,
      name: this.symbol,
      tendency: this.orderTendency,
      currentVolumeDifference: this.currentVolumeDifference,
    };
  }

  public getOrdersProperties(type = 'buy') {
    const orderInfo: any = {};
    orderInfo.name = this.symbol;
    orderInfo.exchange = this.exchange;
    orderInfo.type = type;
    switch (type) {
      case 'buy':
        if (this.nearPositionBuy) {
          const buyOrder = this.whaleBuyOrders[this.nearPositionBuy].toJSON();
          orderInfo.id = buyOrder.id;
          orderInfo.details = {
            quantity: Math.round(buyOrder.quantity),
            price: this.nearPositionBuy,
            createdAt: buyOrder.createdAt,
            position: buyOrder.lastPosition,
          };
        } else {
          orderInfo.id = 'NOT_EXISTS';
        }
        break;

      default:
        if (this.nearPositionSell) {
          const sellOrder = this.whaleSellOrders[this.nearPositionSell].toJSON();
          orderInfo.id = sellOrder.id;
          orderInfo.details = {
            quantity: Math.round(sellOrder.quantity),
            price: this.nearPositionSell,
            createdAt: sellOrder.createdAt,
            position: sellOrder.lastPosition,
          };
        } else {
          orderInfo.id = 'NOT_EXISTS';
        }
        break;
    }

    return orderInfo;
  }
  public containsOrders() {
    return Object.keys(this.whaleBuyOrders).length || Object.keys(this.whaleSellOrders).length;
  }
  public containsBuyOrders() {
    return Object.keys(this.whaleBuyOrders).length;
  }
  public containsSellOrders() {
    return Object.keys(this.whaleSellOrders).length;
  }
}
