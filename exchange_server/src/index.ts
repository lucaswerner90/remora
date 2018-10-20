import BinanceConnection from './exchangeAPI/binance/BinanceConnection';
import GDAXConnection from './exchangeAPI/binance/GDAXConnection';

const type = process.env.DEDICATED_TO ||  'BINANCE';
const MAIN_COIN = process.env.MAIN_COIN || 'USDT';
if (type === 'BINANCE') {
  new BinanceConnection(MAIN_COIN);
} else if (type === 'GDAX') {
  new GDAXConnection(MAIN_COIN);
}
