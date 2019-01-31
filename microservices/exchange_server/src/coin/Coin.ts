import Order from './Order';
import RedisClient from '../redis/RedisClient';
import { TCoinRedisKeys, TPricesList, TCoinWhaleOrder, TCoinWhaleOrders, TCoinAlarm } from '../commonTypes';

const redis: RedisClient = new RedisClient();

export default class Coin {
  public symbol: string = '';
  public _redisKeys: TCoinRedisKeys;
  private _url: string = '';
  private _acronym: string = '';
  private _name: string = '';
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
  constructor(symbol: string = '', { acronym = '', url = '', name = '', alarm = { order : 0, volume : 0 } }, against = 'USD', exchange: string = '') {
    this.symbol = symbol;
    this._against = against;
    this._alarm = alarm;
    this._acronym = acronym;
    this._url = url;
    this._name = name;
    this._exchange = exchange;

    this._redisKeys = {
      BUY_ORDER: `${this.id}_buy_order`,
      SELL_ORDER: `${this.id}_sell_order`,
      PRICES_LIST: `${this.id}_prices_list`,
      LATEST_PRICE: `${this.id}_latest_price`,
      VOLUME_DIFFERENCE: `${this.id}_volume_difference`,
      PRICE_CHANGE_24HR: `${this.id}_price_change_24hr`,
    };
    redis.appendCoin(this.basicProperties);
  }
  public get basicProperties() {
    return {
      id: this.id,
      url: this._url,
      exchange: this.exchange,
      against: this.against,
      name: this._name,
      symbol: this._acronym,
    };
  }
  public get against() {
    return this._against;
  }
  public get id() {
    return `${this.exchange}_${this.symbol}`;
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
      this.updateNearOrders();
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
    for (const [_price, _properties] of Object.entries(newOrdersArray)) {
      const price: any = _price;
      const properties: any = _properties;

      if (!whaleOrdersArray[price]) {
          // If the order doesn't exist previously, we create a new one.
        whaleOrdersArray[price] = new Order(this, type, price, parseFloat(properties.value), properties.position);
      } else {
          // Update the new properties if they are different
        if (properties.position !== whaleOrdersArray[price].lastPosition) {
          whaleOrdersArray[price].lastPosition = properties.position;
        }
        if (Math.round(properties.value) !== Math.round(whaleOrdersArray[price].quantity)) {
          whaleOrdersArray[price].quantity = Math.round(properties.value);
        }
      }
    }
    return whaleOrdersArray;
  }

  /**
   *
   * This method is the entrypoint to update the orders of the coin.
   * We receive the raw orders and we have to parse those orders, try to get those which could be a "whale" order and parse that
   * order to create the object and communicate that one
   *
   * @memberof Coin
   */
  public updateOrders(sellOrders = {}, buyOrders = {}) {

    // Delete previous whale orders if they just dissapear
    this.whaleOrders.buy = this._deleteWhaleOrders(this.whaleOrders.buy, buyOrders);

    this.whaleOrders.sell = this._deleteWhaleOrders(this.whaleOrders.sell, sellOrders);

    // Detect new whale orders
    const { sumVolume: buyOrdersVolume, orders: newBuyWhaleOrders } = this._detectWhaleOrders(buyOrders);
    const { sumVolume: sellOrdersVolume, orders: newSellWhaleOrders } = this._detectWhaleOrders(sellOrders);

    // Assign the coin volume for both buy and sell orders
    this._lastBuyVolume = buyOrdersVolume;
    this._lastSellVolume = sellOrdersVolume;

    // Create/update the whale buy orders
    this.whaleOrders.buy = this._assignWhaleOrders('buy', newBuyWhaleOrders, this.whaleOrders.buy);
    // Create/update the whale sell orders
    this.whaleOrders.sell = this._assignWhaleOrders('sell', newSellWhaleOrders, this.whaleOrders.sell);
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
      this.buyPosition = Math.max(...validKeys);
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

  }

  public set sellPosition(newValue: number) {
    this._sellPosition = newValue;
    const redisValue: any = { ...this._commonRedisProperties, order: {}, type: 'sell' };
    if (newValue > -1 && this.whaleOrders.sell[this.sellPosition] && this.whaleOrders.sell[this.sellPosition].toJSON) {
      redisValue.order = this.getOrdersProperties('sell');
    }
    redis.setOrderValue(this._redisKeys.SELL_ORDER, JSON.stringify(redisValue));
  }
  public get sellPosition(): number {
    return this._sellPosition;
  }

  public set buyPosition(newValue: number) {
    this._buyPosition = newValue;
    const redisValue: any = { ...this._commonRedisProperties, order: {}, type: 'buy' };
    if (newValue > -1 && this.whaleOrders.buy[this.buyPosition] &&
      this.whaleOrders.buy[this.buyPosition].toJSON) {
      redisValue.order = this.getOrdersProperties('buy');
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
    for (const price in whaleOrders) {
      if (!newCoinOrders[price] || (newCoinOrders[price] * parseFloat(price)) < this.alarm.order) {
        console.log(`Order for ${this.id} has been deleted at ${price}`);
        delete whaleOrders[price];
      }
    }
    return whaleOrders;
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

  public _detectWhaleOrders(newOrders = {}) {
    const orders = {};
    let sumVolume: number = 0;
    let position: number = 0;
    for (const price in newOrders) {
      if (newOrders.hasOwnProperty(price)) {
        const quantity = newOrders[price];
        const value = Math.round(parseFloat(price) * parseFloat(quantity));
        position++;
        sumVolume += value;
        if (value >= this.alarm.order) {
          orders[price] = { value, position };
        }
      }
    }
    return { sumVolume, orders };
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
