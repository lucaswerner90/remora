import BinanceConnection from './exchangeAPI/BinanceConnection';
import GDAXConnection from './exchangeAPI/GDAXConnection';

const type = process.env.DEDICATED_TO ||  'binance';
const MAIN_COIN = process.env.MAIN_COIN || 'USD';
if (type === 'binance') {
  new BinanceConnection(MAIN_COIN);
} else if (type === 'gdax') {
  new GDAXConnection(MAIN_COIN);
}
