
import * as mongoose from 'mongoose';

const MongoSchema = mongoose.Schema;

const schema = {
  _id: {
    type: String,
    default: '',
    required:true,
  },
  selectedCoin: {
    type: String,
    default: 'binance_ETHUSDT',
  },
  favorites: {
    type: Array,
    default: ['binance_ETHUSDT', 'binance_BTCUSDT'],
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
};

export default class UserSchema {
  private static model = mongoose.model('userModel', new MongoSchema(schema, { versionKey: false }));

  public async writeUserFavorites(email = '', { favorites = [] }) {
    const model:any = await UserSchema.model.findById(email);
    if (!model) {
      const newUser = new UserSchema.model({ favorites, _id:email });
      const reply = await newUser.save();
      return reply;
    }
    model.favorites = favorites;
    const reply = await model.save();
    return reply;
  }

  public async createNewUser(email:string= '') {
    const newUser = new UserSchema.model({ _id: email });
    const reply = await newUser.save();
    return reply;
  }

  public async writeUserSelectedCoin(email = '', { selected = '' }) {
    const model:any = await UserSchema.model.findById(email);
    if (!model) {
      const newUser = new UserSchema.model({ selectedCoin: selected, _id:email });
      const reply = await newUser.save();
      return reply;
    }
    model.selectedCoin = selected;
    const reply = await model.save();
    return reply;
  }
  public async getUser(email: string = '') {
    return await UserSchema.model.findById(email);
  }
}
