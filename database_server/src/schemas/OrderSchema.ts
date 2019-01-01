import Schema from './Schema';

import * as mongoose from 'mongoose';

const MongoSchema = mongoose.Schema;

const schema = {
  _id: {
    type: String,
    required: true,
    default: '',
  },
  name: {
    type: String,
    required: true,
    default: '',
  },
  exchange: {
    type: String,
    required: true,
    default: '',
  },
  type: {
    type: String,
    required: true,
    enum: ['buy', 'sell'],
    default: 'buy',
  },
  details: {
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, required: true, min: 0 , default: 0 },
    position: { type: Number, required: true, min: 0 , default: 0 },
  },

};
export default class OrderSchema extends Schema{
  private static model = mongoose.model('orderModel', new MongoSchema(schema, { versionKey: false }));
  constructor(channel:string, message:string) {
    super(channel, message);
    this.writeToDB();
  }

  writeToDB() {
    OrderSchema.model.findByIdAndUpdate(this.info.id, this.info, this._writeOptions, (err, res) => {
      if (err) {
        console.trace(err);
      }
    });
  }
}
