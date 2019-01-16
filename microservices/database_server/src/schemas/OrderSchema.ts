import Schema from './Schema';

import * as mongoose from 'mongoose';

const MongoSchema = mongoose.Schema;

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
    OrderSchema.model.findByIdAndUpdate(this.info.id, this.info, this._writeOptions, (err, res) => {
      if (err) {
        console.log(err);
      }
    });
  }
}
