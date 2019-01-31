import Order from "./coin/Order";
import Coin from "./coin/Coin";

// 
// 
// 
// TYPES
// 
// 
// 

export type TCoinWhaleOrders = {
  buy: TCoinWhaleOrder;
  sell: TCoinWhaleOrder;
};

export type TPricesList = number[];

export type TCoinRedisKeys = {
  BUY_ORDER: string,
  SELL_ORDER: string,
  PRICES_LIST: string,
  VOLUME_DIFFERENCE: string,
  LATEST_PRICE: string,
  MEAN_ORDER_VALUE: string,
  PRICE_CHANGE_24HR: string,
};

export type TCoinAlarm = {
  volume: number,
  order: number,
};

export type TCoinWhaleOrder = {
  [index: string]: Order;
}

export type TCoinsArray = {
  [propName: string]: Coin;
}

export type TCoinProperties = {
  symbol: string;
  name: string;
  alarm: {
    order: number;
    volume: number;
  }
  against: string;
}
// 
// 
// 
// INTERFACES
// 
// 
// 

export interface IRawCoinWhaleOrder {
  [index: number]: number;
}
