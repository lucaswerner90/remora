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
    type: [],
    default:[],
  },
  tendency: {
    type: String,
    enum: ['buy', 'sell'],
  },
  currentVolumeDifference: {
    type: Number,
    default: 0,
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
      case 'price_list_1min':
        this.writePriceList(this.info);
        break;
      case 'volume_difference':
        this.writeVolumeDifference(this.info);
      default:
        break;
    }
  }

  private writePriceChange({ coin, price }) {
    CoinSchema.model.findByIdAndUpdate(coin.id, { symbol: coin.symbol, exchange: coin.exchange, priceChange24hr: parseFloat(price) }, this._writeOptions, (err, res) => {
      if (err) {
        console.trace(err);
      }
    });
  }
  private writeLatestPrice({ coin , price }) {
    CoinSchema.model.findByIdAndUpdate(coin.id, { symbol: coin.symbol, exchange: coin.exchange, price: parseFloat(price) }, this._writeOptions, (err, res) => {
      if (err) {
        console.trace(err);
      }
    });
  }

  private writePriceList({ coin, prices }) {
    CoinSchema.model.findByIdAndUpdate(coin.id, { symbol: coin.symbol, exchange: coin.exchange, listOfPrices: prices }, this._writeOptions, (err, res) => {
      if (err) {
        console.trace(err);
      }
    });
  }
  private writeVolumeDifference({ coin, tendency, currentVolumeDifference }) {
    CoinSchema.model.findByIdAndUpdate(coin.id, { tendency, currentVolumeDifference, symbol: coin.symbol, exchange: coin.exchange }, this._writeOptions, (err, res) => {
      if (err) {
        console.trace(err);
      }
    });
  }
}
