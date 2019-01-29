import Coin from './Coin';
import RedisClient from '../redis/RedisClient';
const redis: RedisClient = new RedisClient();

type OrderEvents = {
  price: {
    whenCreated: number,
    afterCreated: {
      five: number,
      ten: number,
      twenty: number,
    },
    afterExecuted: {
      five: number,
      ten: number,
      twenty: number,
    },
  },
};

export default class Order {

  private _type: string;
  private _price: number;
  private _initialPosition: number;
  private _createdAt: Date;
  private _lastUpdateDate: Date;
  private _coin: Coin;
  private _lastPosition: number;
  private _initialQuantity: number;
  private _currentQuantity: number;
  private _id: string;
  private _events: OrderEvents;
  constructor(coin: Coin, type: string = 'buy', price:number = 0, quantity: number = 0, initialPosition: number = 0) {
    this._coin = coin;
    // Order info
    // "buy" or "sell"
    this._type = type;
    this._price = price;
    // Quantity of the order
    this._initialQuantity = Math.round(quantity);
    this._currentQuantity = Math.round(quantity);

    // When the order was created
    this._createdAt = new Date();

    // Last order update
    this._lastUpdateDate = new Date();

    // Position where the order was discovered first
    this._initialPosition = initialPosition;

    // Last known position of the order
    this._lastPosition = initialPosition;

    this._id = `${this._coin.symbol}_${this._coin.exchange}_${this._createdAt.getTime()}`;

    this._events = {
      price: {
        whenCreated: this._coin.actualPrice,
        afterCreated: {
          five: 0,
          ten: 0,
          twenty:0,
        },
        afterExecuted: {
          five: 0,
          ten: 0,
          twenty: 0,
        },
      },
    };

    this.afterCreatedIntervals();
  }
  private afterCreatedIntervals() {
    setTimeout(async() => {
      const redisKey = this._coin._redisKeys.LATEST_PRICE;

      try {
        const { price = 0 } = await redis.getKeyValue(redisKey);
        this._events.price.afterCreated.five = parseInt(price);
      } catch (error) {
        throw error;
      }
    }, 5 * 60 * 1000);
    setTimeout(async() => {
      const redisKey = this._coin._redisKeys.LATEST_PRICE;

      try {
        const { price = 0 } = await redis.getKeyValue(redisKey);
        this._events.price.afterCreated.ten = parseInt(price);
      } catch (error) {
        throw error;
      }
    }, 10 * 60 * 1000);
    setTimeout(async() => {
      const redisKey = this._coin._redisKeys.LATEST_PRICE;

      try {
        const { price = 0 } = await redis.getKeyValue(redisKey);
        this._events.price.afterCreated.twenty = parseInt(price);
      } catch (error) {
        throw error;
      }
    }, 20 * 60 * 1000);

  }

  public get hasBeenExecuted() {
    return this._lastPosition === 1;
  }

  public toJSON() {
    return {
      id: this._id,
      initialValues: {
        position: this._initialPosition,
        quantity: this._initialQuantity,
      },
      currentValues: {
        position: this.lastPosition,
        lastUpdate: this._lastUpdateDate,
        quantity: this._currentQuantity,
      },
      price: this._price,
      type: this._type,
      events: this._events,
      createdAt: this._createdAt,
      hasBeenExecuted: this.hasBeenExecuted,
    };
  }

  public get lastPosition() {
    return this._lastPosition;
  }
  public set lastPosition(pos: number) {
    const executedBefore = this.hasBeenExecuted;
    this._lastPosition = pos;
    this._lastUpdateDate = new Date();
    if (!executedBefore && this.hasBeenExecuted) {
      this.afterExecutedIntervals();
    }
  }

  private afterExecutedIntervals() {
    setTimeout(async () => {
      const redisKey = this._coin._redisKeys.LATEST_PRICE;

      try {
        const { price = 0 } = await redis.getKeyValue(redisKey);
        this._events.price.afterExecuted.five = parseInt(price);
      } catch (error) {
        throw error;
      }
    }, 5 * 60 * 1000);
    setTimeout(async () => {
      const redisKey = this._coin._redisKeys.LATEST_PRICE;

      try {
        const { price = 0 } = await redis.getKeyValue(redisKey);
        this._events.price.afterExecuted.ten = parseInt(price);
      } catch (error) {
        throw error;
      }
    }, 10 * 60 * 1000);
    setTimeout(async () => {
      const redisKey = this._coin._redisKeys.LATEST_PRICE;

      try {
        const { price = 0 } = await redis.getKeyValue(redisKey);
        this._events.price.afterExecuted.twenty = parseInt(price);
      } catch (error) {
        throw error;
      }
    }, 20 * 60 * 1000);

  }

  public get quantity() {
    return this._currentQuantity;
  }

  public set quantity(quantity: number) {
    this._currentQuantity = Math.round(quantity);
    this._lastUpdateDate = new Date();
  }

}
