import Order from './Order';
import RedisClient from '../redis/RedisClient';
import { TCoinRedisKeys, TPricesList, TCoinWhaleOrder, TCoinWhaleOrders, IRawCoinWhaleOrder, TCoinAlarm } from '../commonTypes';

const redis: RedisClient = new RedisClient();

export default class Coin {
  public symbol: string = '';
  public _redisKeys: TCoinRedisKeys;
  private _actualPrice: number = 0;
  private _buyPosition: number;
  private _sellPosition: number;
  private _pricesList: TPricesList = [];
  private _whaleOrders: TCoinWhaleOrders = { buy: {}, sell:{} };
  private _alarm: TCoinAlarm;
  private _exchange: string;
  private _currentVolumeDifference: number = 0;
  private _lastBuyVolume: number = 0;
  private _lastSellVolume: number = 0;
  private _priceChange24hr: number = -1;
  private _against: string;
  // private _volumeInBetween: number = 0;
  private buyOrders: {};
  private sellOrders: {};
  constructor(symbol: string = '', { alarm = { order : 0, volume : 0 } }, against = 'USD', exchange: string = '') {
    this.symbol = symbol;
    this._against = against;
    this._alarm = alarm;
    this._exchange = exchange;

    this._redisKeys = {
      BUY_ORDER: `${this.exchange}_${this.symbol}_buy_order`,
      SELL_ORDER: `${this.exchange}_${this.symbol}_sell_order`,
      PRICES_LIST: `${this.exchange}_${this.symbol}_prices_list`,
      LATEST_PRICE: `${this.exchange}_${this.symbol}_latest_price`,
      VOLUME_DIFFERENCE: `${this.exchange}_${this.symbol}_volume_difference`,
      PRICE_CHANGE_24HR: `${this.exchange}_${this.symbol}_price_change_24hr`,
    };
  }
  public get against() {
    return this._against;
  }
  public get id() {
    return `${this.symbol}_${this.exchange}`;
  }

  private get _commonRedisProperties() {
    return {
      coin: {
        id: this.id,
        symbol: this.symbol,
        exchange: this.exchange,
      },
    };
  }
  public set priceChange24hr(newValue:number) {
    if (!isNaN(newValue) && isFinite(newValue)) {
      this._priceChange24hr = newValue;
      const redisValue = {
        ...this._commonRedisProperties,
        price: this._priceChange24hr,
      };
      redis.setPriceChange(this._redisKeys.PRICE_CHANGE_24HR, JSON.stringify(redisValue));
    }
  }

  public get priceChange24hr() {
    return this._priceChange24hr;
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
    return this._currentVolumeDifference > this.alarm.volume;
  }

  public get tendency() {
    return this._lastBuyVolume > this._lastSellVolume ? 'buy' : 'sell';
  }

  public set actualPrice(newValue: number) {
    if (newValue > 0) {
      this._actualPrice = newValue;
      const redisValue = {
        ...this._commonRedisProperties,
        price: this._actualPrice,
      };
      redis.setLatestPrice(this._redisKeys.LATEST_PRICE, JSON.stringify(redisValue));
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
    this._pricesList = prices.splice(prices.length - 100, prices.length - 1);
    // Set the new value for the redis key's last order
    const redisValue = {
      ...this._commonRedisProperties,
      prices: this._pricesList,
    };
    redis.setPricesList(this._redisKeys.PRICES_LIST, JSON.stringify(redisValue));
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
            hasBeenModified = true;
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
    this.buyOrders = buyOrders;
    this.sellOrders = sellOrders;

    // Delete previous whale orders if they just dissapear
    const deletedBuyOrders = this._deleteWhaleOrders(this.whaleOrders.buy, buyOrders);
    if (deletedBuyOrders.numOrdersDeleted) {
      this.whaleOrders.buy = deletedBuyOrders.whaleOrders;
    }

    const deletedSellOrders = this._deleteWhaleOrders(this.whaleOrders.sell, sellOrders);
    if (deletedSellOrders.numOrdersDeleted) {
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
        this.whaleOrders.buy = assignNewBuyOrders.whaleOrdersArray;
      }
    }
    if (newSellOrders.numOrders) {
      // Create/update the whale sell orders
      const assignNewSellOrders = this._assignWhaleOrders('sell', newSellOrders, this.whaleOrders.sell);
      if (assignNewSellOrders.hasBeenModified) {
        this.whaleOrders.sell = assignNewSellOrders.whaleOrdersArray;
      }
    }
    this.updateNearOrders();

  }

  public calculateVolumeInBetweenWhaleOrders(buyOrders = this.buyOrders, sellOrders = this.sellOrders) {
    const validBuyKeys = Object.keys(buyOrders)
      .map(key => parseFloat(key))
      .filter(key => key >= this.buyPosition && key <= this.actualPrice);
    const validSellKeys = Object.keys(sellOrders)
      .map(key => parseFloat(key))
      .filter(key => key >= this.actualPrice && key <= this.sellPosition);

    console.log(`Price: ${this.actualPrice}, buyOrders: ${validBuyKeys.length}, sellOrders: ${validSellKeys.length}`);
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
      const validKeys = Object.keys(this.whaleOrders.buy)
        .map(key => parseFloat(key))
        .filter(key => key <= this.actualPrice);
      const newPosition = Math.max(...validKeys);
      this.buyPosition = newPosition;
    } else {
      this.buyPosition = -1;
    }

    if (this.containsSellOrders()) {
      const validKeys = Object.keys(this.whaleOrders.sell)
        .map(key => parseFloat(key))
        .filter(key => key >= this.actualPrice);
      this.sellPosition = Math.min(...validKeys);
    } else {
      this.sellPosition = -1;
    }

    if (this.sellPosition > -1 && this.buyPosition > -1) {
      this.calculateVolumeInBetweenWhaleOrders(this.buyOrders, this.sellOrders);
    }
  }

  public set sellPosition(newValue: number) {
    this._sellPosition = newValue;
    let redisValue: any = { ...this._commonRedisProperties, order: {}, type: 'sell' };
    if (newValue > -1 && this.whaleOrders.sell[this.sellPosition] && this.whaleOrders.sell[this.sellPosition].toJSON) {
      redisValue = {
        ...this._commonRedisProperties,
        order: this.getOrdersProperties('sell'),
      };
    }
    redis.setOrderValue(this._redisKeys.SELL_ORDER, JSON.stringify(redisValue));
  }
  public get sellPosition(): number {
    return this._sellPosition;
  }

  public set buyPosition(newValue: number) {
    this._buyPosition = newValue;
    let redisValue: any = { ...this._commonRedisProperties, order: {}, type: 'buy' };
    if (newValue > -1 && this.whaleOrders.buy[this.buyPosition] &&
      this.whaleOrders.buy[this.buyPosition].toJSON) {
      redisValue = { ...redisValue, order: this.getOrdersProperties('buy') };
    }
    redis.setOrderValue(this._redisKeys.BUY_ORDER, JSON.stringify(redisValue));
  }
  public get buyPosition(): number {
    return this._buyPosition;
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
      const value = Math.round(price * coinQuantity);
      if (whaleOrders[orderPrice] && value < this.alarm.order) {
        whaleOrders[orderPrice] = undefined;
        numOrdersDeleted++;
      }
    }
    return { whaleOrders, numOrdersDeleted };
  }

  public calculateVolumeDifference() {
    const buyVolume = this._lastBuyVolume;
    const sellVolume = this._lastSellVolume;
    const currentVolumeDifference = Math.abs(Math.round(((buyVolume >= sellVolume ? buyVolume / sellVolume : sellVolume / buyVolume)) * 100) - 100);

    if (currentVolumeDifference !== this._currentVolumeDifference) {
      this._currentVolumeDifference = currentVolumeDifference;

      const redisValue = { ...this._commonRedisProperties, volumeDifference: this._currentVolumeDifference };
      redis.setVolumeDifferenceValue(this._redisKeys.VOLUME_DIFFERENCE, JSON.stringify(redisValue));
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
      const value = Math.round(price * coinQuantity);
      position++;
      sumVolume += value;
      if (value > this.alarm.order) {
        whaleOrders[price] = { value, position };
        numOrders++;
      }
    }
    return { numOrders, sumVolume, orders: whaleOrders };
  }

  public getOrdersProperties(type: 'buy' | 'sell' = 'buy') {
    return type === 'buy' ? this.whaleOrders.buy[this.buyPosition].toJSON() : this.whaleOrders.sell[this.sellPosition].toJSON();
  }
  public containsOrders() {
    return this.containsBuyOrders() || this.containsSellOrders();
  }
  public containsBuyOrders() {
    return Object.keys(this.whaleOrders.buy).length > 0;
  }
  public containsSellOrders() {
    return Object.keys(this.whaleOrders.sell).length > 0;
  }
}
