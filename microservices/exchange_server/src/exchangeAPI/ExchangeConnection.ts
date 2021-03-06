import { TCoinsArray, TCoinProperties } from '../commonTypes';
import Coin from '../coin/Coin';

/**
 * Base class to create the different exchange connections
 *
 * @export
 * @class ExchangeConnection
 */
export default class ExchangeConnection {

  /**
   *
   * Exchange name
   * @protected
   * @type {string}
   * @memberof ExchangeConnection
   */
  protected _name: string;

  /**
   *
   * List of coin objects
   * @protected
   * @type {TCoinsArray}
   * @memberof ExchangeConnection
   */
  protected _coinsArray: TCoinsArray = {};

  /**
   *
   * Main coin for the server, it could be USD, ETH, BTC, etc...
   * @protected
   * @type {string}
   * @memberof ExchangeConnection
   */
  protected _mainCoin: string = 'USD';

  /**
   *
   * Raw coin list that contains the information from the JSON file
   * @protected
   * @type {TCoinProperties[]}
   * @memberof ExchangeConnection
   */
  protected _coinsList: TCoinProperties[];

  constructor(mainCoin: string, name: string) {
    console.log(`Starting new ${name} server connection for ${mainCoin}`);
    this._name = name;
    this._mainCoin = mainCoin;
    this.config();
    this.coinsList = this.getCoins(this.mainCoin);
  }
  protected get mainCoin() {
    return this._mainCoin;
  }
  protected get coinsArray() {
    return this._coinsArray;
  }
  protected get name() {
    return this._name;
  }

  /**
   *
   * Setter whose mission is to create every coin configuration detected in the JSON file
   * @protected
   * @memberof ExchangeConnection
   */
  protected set coinsList(newValue: TCoinProperties[]) {
    this._coinsList = newValue;
    // Once we have the coins for the instance we need to initialize both the coin object and the websockets associated to it
    Object.keys(this._coinsList).forEach((coin: string) => {
      this.createCoinConfiguration(coin, this._coinsList[coin]);
    });
  }

  /**
   *
   * Creates each coin configuration, initializes the websockets and the intervals.
   * @protected
   * @param {string} [coin='']
   * @param {TCoinProperties} coinProperties
   * @memberof ExchangeConnection
   */
  private createCoinConfiguration(coin: string = '', coinProperties: TCoinProperties) {
    this.coinsArray[coin] = new Coin(coin, coinProperties, this.mainCoin, this.name);
    this.createCoinWebSockets(this.coinsArray[coin]);
  }
  /**
   *
   * Creates the different websockets connections if needed
   * @protected
   * @param {Coin} coin
   * @returns {*}
   * @memberof ExchangeConnection
   */
  protected createCoinWebSockets(coin: Coin): any {
    throw new Error('<ExchangeConnection> createCoinWebSockets method must be implemented in the child class.');
  }

  /**
   *
   * Get the different coins based on the @property {mainCoin} property
   * @protected
   * @param {string} mainCoin
   * @returns {TCoinProperties[]}
   * @memberof ExchangeConnection
   */
  protected getCoins(mainCoin: string): TCoinProperties[] {
    throw new Error('<ExchangeConnection> getCoins method must be implemented in the child class.');
  }

  /**
   *
   * If the exchange needs any special configuration it must be included here
   * @protected
   * @returns {*}
   * @memberof ExchangeConnection
   */
  protected config(): void {
    throw new Error('<ExchangeConnection> config method must be implemented in the child class.');
  }
}
