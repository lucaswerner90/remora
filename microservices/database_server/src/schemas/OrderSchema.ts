import Schema from './Schema';

import * as mongoose from 'mongoose';

const MongoSchema = mongoose.Schema;

const day = 24 * 60 * 60 * 1000;
const week = 7 * 24 * 60 * 60 * 1000;

const times = { day, week };

const schema = {
  _id: {
    type: String,
    required: true,
    default: '',
  },
  initialValues: {
    position: {
      type: Number,
      required: true,
      default: 1,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  currentValues: {
    position: {
      type: Number,
      required: true,
      default: 1,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    lastUpdateDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  coin: {
    id: {
      type: String,
      required: true,
      default: '',
    },
    symbol: {
      type: String,
      required: true,
      default: '',
    },
    exchange: {
      type: String,
      required: true,
      enum: ['binance', 'gdax'],
      default: 'binance',
    },
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  type: {
    type: String,
    required: true,
    enum: ['buy', 'sell'],
    default: 'buy',
  },
  events: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  hasBeenExecuted: {
    type: Boolean,
    required: true,
    default: false,
  },
};
export default class OrderSchema extends Schema{
  private static model = mongoose.model('orderModel', new MongoSchema(schema, { versionKey: false }));
  constructor(channel:string, message:string) {
    super(channel, message);
    if (this.info) {
      this.writeToDB();
    }
  }

  writeToDB() {
    const { order, coin } = this.info;
    order.price = parseFloat(order.price);
    if (!order.id) console.log(order);
    OrderSchema.model.findByIdAndUpdate(order.id, { ...order, coin } , this._writeOptions, (err, res) => {
      if (err) {
        console.log(err);
      }
      this.getTotalCount(coin.id, order.type, 'day');
      this.getTotalCount(coin.id, order.type, 'week');
    });
  }

  getTotalCount(coinID = 'binance_BTCUSDT', type: 'buy' | 'sell' = 'buy', timeAgo: 'day' | 'week' = 'day') {
    const now = Date.now();
    OrderSchema.model.find({ 'coin.id': coinID })
      .where('createdAt')
      .gt(times[timeAgo])
      .lt(now)
      .where('type')
      .equals(type)
      .countDocuments((err, data) => {
        if (err) throw err;
        this.updateTotalCount(coinID, data, type, timeAgo);
      });
  }

  updateTotalCount(coinID:string= 'binance_BTCUSDT', count:number= 0, type: 'buy'|'sell' = 'buy', timeAgo:'day'|'week'= 'day') {
    const countInfo = { timeAgo, type, count, coin: this.info.coin };
    OrderSchema.redis.set(`${coinID}_${type}_${timeAgo}`, count.toString());
    OrderSchema.redis.publish('count_orders', JSON.stringify(countInfo));
  }
}
