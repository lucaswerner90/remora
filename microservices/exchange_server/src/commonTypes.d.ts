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

export type TPricesList = any[];

export type TCoinRedisKeys = {
  PREVIOUS_BUY_ORDER: string,
  BUY_ORDER: string,
  PREVIOUS_SELL_ORDER: string,
  SELL_ORDER: string,
  PRICES_LIST_1MIN: string,
  PRICES_LIST_5MIN: string,
  PRICES_LIST_15MIN: string,
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
