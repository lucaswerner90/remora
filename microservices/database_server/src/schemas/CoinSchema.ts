import Schema from './Schema';
import * as mongoose from 'mongoose';

const MongoSchema = mongoose.Schema;

const schema = {
  _id: {
    type: String,
    default: '',
  },
  symbol: {
    type: String,
    default: '',
  },
  exchange: {
    type: String,
    enum: ['binance', 'gdax'],
  },
  priceChange24hr: {
    type: Number,
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
    if (this.info) {
      this.writeToDB();
    }
  }

  writeToDB() {
    switch (this.channel) {
      case 'price_change_24hr':
        this.writePriceChange(this.info);
        break;
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

  private writePriceChange({ id, symbol, exchange, price }) {
    CoinSchema.model.findByIdAndUpdate(id, { symbol, exchange, priceChange24hr: parseFloat(price) }, this._writeOptions, (err, res) => {
      if (err) {
        console.trace(err);
      }
    });
  }
  private writeLatestPrice({ id, symbol, exchange, price }) {
    CoinSchema.model.findByIdAndUpdate(id, { symbol, exchange, price: parseFloat(price) }, this._writeOptions, (err, res) => {
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
  private writeVolumeDifference({ id, tendency, symbol, exchange, currentVolumeDifference }) {
    CoinSchema.model.findByIdAndUpdate(id, { symbol, exchange, tendency, currentVolumeDifference }, this._writeOptions, (err, res) => {
      if (err) {
        console.trace(err);
      }
    });
  }
}
