export default class Order {

  private symbol: string;
  private type: string;
  private exchange: string;
  private coinSellVolume: number;
  private coinBuyVolume: number;
  private price: number;
  private volumeChange24h: number;
  private initialPosition: number;
  private createdAt: Date;
  private _lastUpdateDate: Date;

  private _lastPosition: number;
  private _initialQuantity: number;
  private _quantity: number;
  private _executed: boolean;
  private id: string;
  constructor(symbol: string = '', type: string = 'buy', quantity: number = 0, coinSellVolume: number = 0, initialPosition: number = 0, coinBuyVolume: number= 0, lastPrice: number= 0, exchange: string= 'binance', volumeChange24h: number= 0) {
    // Coin info
    this.symbol = symbol;
    this.exchange = exchange;
    this.coinSellVolume = coinSellVolume;
    this.coinBuyVolume = coinBuyVolume;
    this.price = lastPrice;
    this.volumeChange24h = volumeChange24h;

    // Order info
    // "buy" or "sell"
    this.type = type;

    // Quantity of the order
    this._initialQuantity = quantity;
    this._quantity = quantity;

    // When the order was created
    this.createdAt = new Date();

    // Last order update
    this._lastUpdateDate = new Date();

    // Position where the order was discovered first
    this.initialPosition = initialPosition;

    // Last known position of the order
    this._lastPosition = initialPosition;

    this._executed = initialPosition === 1;

    this.id = `${this.symbol}_${this.exchange}_${this.createdAt.getTime()}`;
  }

  public toJSON() {
    return {
      coinBuyVolume: this.coinBuyVolume,
      coinSellVolume: this.coinSellVolume,
      createdAt: this.createdAt,
      exchange: this.exchange,
      executed: this._executed,
      id: this.id,
      initialPosition: this.initialPosition,
      initialQuantity: this._initialQuantity,
      lastPosition: this._lastPosition,
      lastUpdateDate: this._lastUpdateDate,
      price: this.price,
      quantity: this._quantity,
      symbol: this.symbol,
      type: this.type,
      volumeChange24h: this.volumeChange24h,
    };
  }

  public get lastPosition() {
    return this._lastPosition;
  }
  public set lastPosition(pos: number) {
    this._lastPosition = pos;
    this._lastUpdateDate = new Date();
    this._executed = pos === 1;
  }

  public get quantity() {
    return this._quantity;
  }

  public set quantity(quantity: number) {
    this._quantity = quantity;
    this._lastUpdateDate = new Date();
  }

}
