import BinanceConnection from './exchangeAPI/BinanceConnection';
import GDAXConnection from './exchangeAPI/GDAXConnection';

const type = process.env.DEDICATED_TO ||  'BINANCE';
const MAIN_COIN = process.env.MAIN_COIN || 'USD';
if (type === 'BINANCE') {
  new BinanceConnection(MAIN_COIN);
} else if (type === 'GDAX') {
  new GDAXConnection(MAIN_COIN);
}
