import Schema from './Schema';

import * as mongoose from 'mongoose';

const MongoSchema = mongoose.Schema;

const schema = {
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  exchange: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['buy', 'sell'],
  },
  details: {
    createdAt: {
      type: Date,
      required: true,
    },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    position: { type: Number, required: true, min: 0 },
  },

};
export default class OrderSchema extends Schema{
  private static model = mongoose.model('orderModel', new MongoSchema(schema));
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
