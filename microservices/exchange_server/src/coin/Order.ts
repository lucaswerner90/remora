import Coin from './Coin';

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
  constructor(coin: Coin, type: string = 'buy', quantity: number = 0, initialPosition: number = 0) {
    this._coin = coin;
    // Order info
    // "buy" or "sell"
    this._type = type;

    // Quantity of the order
    this._initialQuantity = quantity;
    this._currentQuantity = quantity;

    // When the order was created
    this._createdAt = new Date();

    // Last order update
    this._lastUpdateDate = new Date();

    // Position where the order was discovered first
    this._initialPosition = initialPosition;

    // Last known position of the order
    this._lastPosition = initialPosition;

    this._id = `${this._coin.symbol}_${this._coin.exchange}_${this._createdAt.getTime()}`;
  }
  public get hasBeenExecuted() {
    return this._lastPosition === 1;
  }

  public toJSON() {
    return {
      coin: {
        currentVolumes: this._coin.currentVolumes,
        exchange: this._coin.exchange,
        symbol: this._coin.symbol,
        volumeChange24h: this._coin.existsVolumeDifference,
      },
      createdAt: this._createdAt,
      hasBeenExecuted: this.hasBeenExecuted,
      id: this._id,
      initialPosition: this._initialPosition,
      initialQuantity: this._initialQuantity,
      lastPosition: this._lastPosition,
      lastUpdateDate: this._lastUpdateDate,
      price: this._price,
      quantity: this._currentQuantity,
      type: this._type,
    };
  }

  public get lastPosition() {
    return this._lastPosition;
  }
  public set lastPosition(pos: number) {
    this._lastPosition = pos;
    this._lastUpdateDate = new Date();
  }

  public get quantity() {
    return this._currentQuantity;
  }

  public set quantity(quantity: number) {
    this._currentQuantity = quantity;
    this._lastUpdateDate = new Date();
  }

}
