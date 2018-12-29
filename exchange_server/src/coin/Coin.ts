import Order from './Order';
import RedisClient from '../redis/RedisClient';
import { TCoinRedisKeys, TPricesList, TCoinWhaleOrder, TCoinWhaleOrders, IRawCoinWhaleOrder, TCoinAlarm } from '../commonTypes';

const redis: RedisClient = new RedisClient();

export default class Coin {
  public symbol: string = '';
  private _redisKeys: TCoinRedisKeys;
  private _actualPrice: number = 0;
  private _nearPositionBuy: number;
  private _nearPositionSell: number;
  private _pricesList: TPricesList = [];
  private _whaleOrders: TCoinWhaleOrders = { buy: {}, sell:{} };
  private _alarm: TCoinAlarm;
  private _exchange: string;
  private against: string;
  private currentVolumeDifference: number = 0;
  private _lastBuyVolume: number = 0;
  private _lastSellVolume: number = 0;
  constructor(symbol: string = '', { alarm = { order : 0, volume : 0 } }, against = 'USD', exchange: string = '') {
    this.symbol = symbol;
    this.against = against;
    this._alarm = alarm;
    this._exchange = exchange;

    this._redisKeys = {
      NEAR_BUY_ORDER: `${this.exchange}_${this.symbol}_${this.against}_buy_near_order`,
      NEAR_SELL_ORDER: `${this.exchange}_${this.symbol}_${this.against}_sell_near_order`,
      PRICES_LIST: `${this.exchange}_${this.symbol}_${this.against}_prices_list`,
      LATEST_PRICE: `${this.exchange}_${this.symbol}_${this.against}_latest_price`,
      VOLUME_DIFFERENCE: `${this.exchange}_${this.symbol}_${this.against}_volume_difference`,
    };
  }

  public get currentVolumes() {
    return { buy: this._lastBuyVolume, sell: this._lastSellVolume };
  }

  public get exchange() {
    return this._exchange;
  }

  public get alarm() {
    return this._alarm;
  }

  public get whaleOrders() {
    return this._whaleOrders;
  }

  public set whaleOrders(newValue) {
    this._whaleOrders = newValue;
  }

  public get existsVolumeDifference() {
    return this.currentVolumeDifference > this.alarm.volume;
  }

  public get tendency() {
    return this._lastBuyVolume > this._lastSellVolume ? 'buy' : 'sell';
  }

  public set actualPrice(newValue: number) {
    if (newValue > 0) {
      this._actualPrice = newValue;
      const redisValue = JSON.stringify({ symbol: this.symbol, exchange: this.exchange, price: this._actualPrice });
      redis.setLatestPrice(this._redisKeys.LATEST_PRICE, redisValue);
    }
  }

  public get actualPrice() {
    return this._actualPrice;
  }

  /**
   * Updates the prices list for the coin and updates the Redis key that contains the list
   *
   * @param {[]} {prices}
   * @memberof Coin
   */
  public set pricesList(prices: TPricesList) {
    this._pricesList = prices;
    // Set the new value for the redis key's last order
    const redisValue = JSON.stringify({ symbol: this.symbol, exchange: this.exchange, prices: this._pricesList });
    redis.setPricesList(this._redisKeys.PRICES_LIST, redisValue);
  }

  /**
   *
   * This method creates and updates the whale coin orders
   * @private
   * @param {string} type
   * @param {*} newOrdersArray
   * @param {TCoinWhaleOrder} whaleOrdersArray
   * @memberof Coin
   */

  private _assignWhaleOrders(type: string, newOrdersArray: any, whaleOrdersArray: TCoinWhaleOrder) {
    let hasBeenModified = false;
    if (newOrdersArray.numOrders > 0) {
      for (const [_price, _properties] of Object.entries(newOrdersArray.orders)) {
        const price: any = _price;
        const properties: any = _properties;

        if (!whaleOrdersArray[price]) {
          // If the order doesn't exist previously, we create a new one.
          whaleOrdersArray[price] = new Order(this, type, parseFloat(properties.value), properties.position);

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
   *
   * @memberof Coin
   */
  public updateOrders({ sellOrders = {}, buyOrders = {} }) {
    let needToUpdateOrders = false;
    // Delete previous whale orders if they just dissapear
    const deletedBuyOrders = this._deleteWhaleOrders(this.whaleOrders.buy, buyOrders);
    if (deletedBuyOrders.numOrdersDeleted) {
      needToUpdateOrders = true;
      this.whaleOrders.buy = deletedBuyOrders.whaleOrders;
    }

    const deletedSellOrders = this._deleteWhaleOrders(this.whaleOrders.sell, sellOrders);
    if (deletedSellOrders.numOrdersDeleted) {
      needToUpdateOrders = true;
      this.whaleOrders.sell = deletedSellOrders.whaleOrders;
    }

    // Detect possible whale orders
    const newBuyOrders = this._detectWhaleOrders(buyOrders);
    const newSellOrders = this._detectWhaleOrders(sellOrders);

    // Assign the coin volume for both buy and sell orders
    this._lastBuyVolume = newBuyOrders.sumVolume;
    this._lastSellVolume = newSellOrders.sumVolume;

    if (newBuyOrders.numOrders) {
      // Create/update the whale buy orders
      const assignNewBuyOrders = this._assignWhaleOrders('buy', newBuyOrders, this.whaleOrders.buy);
      if (assignNewBuyOrders.hasBeenModified) {
        needToUpdateOrders = true;
        this.whaleOrders.buy = assignNewBuyOrders.whaleOrdersArray;
      }
    }
    if (newSellOrders.numOrders) {
      // Create/update the whale sell orders
      const assignNewSellOrders = this._assignWhaleOrders('sell', newSellOrders, this.whaleOrders.sell);
      if (assignNewSellOrders.hasBeenModified) {
        needToUpdateOrders = true;
        this.whaleOrders.sell = assignNewSellOrders.whaleOrdersArray;
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
      this.nearPositionBuy = Math.max(...Object.keys(this.whaleOrders.buy).map(key => parseFloat(key)));
    }
    if (this.containsSellOrders()) {
      this.nearPositionSell = Math.min(...Object.keys(this.whaleOrders.sell).map(key => parseFloat(key)));
    }
  }

  public set nearPositionSell(newValue: number) {
    if (newValue > -1) {
      this._nearPositionSell = newValue;
      if (this.whaleOrders.sell[this.nearPositionSell].toJSON) {
        const redisValue = JSON.stringify(this.getOrdersProperties('sell'));
        redis.setOrderValue(this._redisKeys.NEAR_SELL_ORDER, redisValue);
      }
    }
  }
  public get nearPositionSell(): number {
    return this._nearPositionSell;
  }

  public set nearPositionBuy(newValue: number) {
    if (newValue > -1) {
      this._nearPositionBuy = newValue;
      if (this.whaleOrders.buy[this.nearPositionBuy].toJSON) {
        const redisValue = JSON.stringify(this.getOrdersProperties('buy'));
        redis.setOrderValue(this._redisKeys.NEAR_BUY_ORDER, redisValue);
      }
    }
  }
  public get nearPositionBuy(): number {
    return this._nearPositionBuy;
  }
  /**
   *
   * Detect if there are orders that have lost their quantity so they don't match the conditions to be a whale order anymore
   * @private
   * @param {TCoinWhaleOrder} whaleOrders
   * @param {*} newCoinOrders
   * @memberof Coin
   */
  private _deleteWhaleOrders(whaleOrders: TCoinWhaleOrder, newCoinOrders: { [s: string]: {}; } | ArrayLike<{}>) {
    let numOrdersDeleted = 0;
    for (const [orderPrice, orderQuantity] of Object.entries(newCoinOrders)) {
      const price: number = parseFloat(orderPrice);
      const coinQuantity: number = parseFloat(orderQuantity.toString());
      const value = price * coinQuantity;
      if (value < this.alarm.order && whaleOrders[orderPrice]) {
        console.log(`Order DELETED at price ${orderPrice} for ${this.symbol}--> Previous value: ${whaleOrders[orderPrice].quantity} New Value: ${value}`);
        delete whaleOrders[orderPrice];
        numOrdersDeleted++;
      }
    }
    return { whaleOrders, numOrdersDeleted };
  }

  public calculateVolumeDifference() {
    const buyVolume = this._lastBuyVolume;
    const sellVolume = this._lastSellVolume;
    const currentVolumeDifference = Math.abs(Math.round(((buyVolume >= sellVolume ? buyVolume / sellVolume : sellVolume / buyVolume)) * 100) - 100);

    if (currentVolumeDifference !== this.currentVolumeDifference) {
      this.currentVolumeDifference = currentVolumeDifference;

      const redisValue = JSON.stringify(this.getVolumeProperties());
      redis.setVolumeDifferenceValue(this._redisKeys.VOLUME_DIFFERENCE, redisValue);
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
      if (value > this.alarm.order) {
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
      tendency: this.tendency,
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
          const { id, quantity, createdAt, lastPosition } = this.whaleOrders.buy[this.nearPositionBuy].toJSON();
          orderInfo.id = id;
          orderInfo.details = {
            createdAt,
            quantity: Math.round(quantity),
            price: this.nearPositionBuy,
            position: lastPosition,
          };
        } else {
          orderInfo.id = 'NOT_EXISTS';
        }
        break;

      default:
        if (this.nearPositionSell) {
          const { id, quantity, createdAt, lastPosition } = this.whaleOrders.sell[this.nearPositionSell].toJSON();
          orderInfo.id = id;
          orderInfo.details = {
            createdAt,
            quantity: Math.round(quantity),
            price: this.nearPositionSell,
            position: lastPosition,
          };
        } else {
          orderInfo.id = 'NOT_EXISTS';
        }
        break;
    }

    return orderInfo;
  }
  public containsOrders() {
    return Object.keys(this.whaleOrders.buy).length || Object.keys(this.whaleOrders.sell).length;
  }
  public containsBuyOrders() {
    return Object.keys(this.whaleOrders.buy).length;
  }
  public containsSellOrders() {
    return Object.keys(this.whaleOrders.sell).length;
  }
}
