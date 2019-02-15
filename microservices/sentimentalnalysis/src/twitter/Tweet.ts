type TUser = {
  screen_name: string,
  location: string,
  url: string,
  profile_image_url: string,
  followers_count: number,
};
type TCoin = {
  name: string,
};

import RedisClient from '../RedisClient';
const redis = new RedisClient();

export default class Tweet {
  private _coin: TCoin;
  private _id: number;
  private _sentiment: number;
  private _text: string = '';
  private _user: TUser;
  private _created: string;
  constructor(id:number, coin: TCoin, text: string = '', user: TUser, sentiment: number, createdAt:string = '') {
    this._id = id;
    this._coin = coin;
    this._user = user;
    this._text = text;
    this._created = createdAt;
    if (sentiment < 0) {
      this._sentiment = -1;
    } else if (sentiment === 0) {
      this._sentiment = 0;
    } else {
      this._sentiment = 1;
    }
  }
  toJSON() {
    return {
      id: this._id,
      coin: this._coin,
      user: this._user,
      text: this._text,
      created: this._created,
      sentiment: this._sentiment,
    };
  }
  appendToTweetList() {
    redis.addTweet(this._coin.name.toLowerCase(), JSON.stringify(this.toJSON()));
  }
  publishToRedis() {
    redis.publishTweet(JSON.stringify(this.toJSON()));
  }
}
