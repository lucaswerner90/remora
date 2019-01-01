import Schema from './Schema';
import * as mongoose from 'mongoose';

const MongoSchema = mongoose.Schema;

const schema = {
  _id: {
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
  },
  price: {
    type: Number,
    min: 0,
  },
  listOfPrices: {
    type: [Number],
  },
  tendency: {
    type: String,
    enum: ['buy', 'sell'],
  },
  currentVolumeDifference: {
    type: Number,
  },
};

export default class CoinSchema extends Schema{
  private static model = mongoose.model('coinModel', new MongoSchema(schema, { versionKey: false }));
  constructor(channel: string, message: {}) {
    super(channel, message);
    this.writeToDB();
  }

  writeToDB() {
    switch (this.channel) {
      case 'latest_price':
        this.writeLatestPrice(this.info);
        break;
      case 'price_list':
        this.writePriceList(this.info);
        break;
      case 'volume_difference':
        this.writeVolumeDifference(this.info);
      default:
        break;
    }
  }

  private writeLatestPrice({ id, symbol, exchange, price }) {
    CoinSchema.model.findByIdAndUpdate(id, { symbol, exchange, price }, this._writeOptions, (err, res) => {
      if (err) {
        console.trace(err);
      }
    });
  }

  private writePriceList({ id, symbol, exchange, prices }) {
    CoinSchema.model.findByIdAndUpdate(id, { symbol, exchange, listOfPrices: prices }, this._writeOptions, (err, res) => {
      if (err) {
        console.trace(err);
      }
    });
  }
  private writeVolumeDifference({ id, exchange, actualPrice, tendency, symbol, currentVolumeDifference }) {
    CoinSchema.model.findByIdAndUpdate(id, { symbol, exchange, tendency, currentVolumeDifference, price: actualPrice }, this._writeOptions, (err, res) => {
      if (err) {
        console.trace(err);
      }
    });
  }
}
