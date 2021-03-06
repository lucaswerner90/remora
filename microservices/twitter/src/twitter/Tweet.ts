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
type TEntities = { urls: any[] };

import RedisClient from '../RedisClient';

export default class Tweet {
  private static redis = new RedisClient();
  private _coin: TCoin;
  private _id: number;
  private _sentiment: number;
  private _text: string = '';
  private _user: TUser;
  private _created: string;
  private _entities: TEntities;
  constructor(id: number, coin: TCoin, text: string = '', entities: TEntities, user: TUser, sentiment: number, createdAt:string = '') {
    this._id = id;
    this._coin = coin;
    this._user = user;
    this._text = text;
    this._entities = entities;
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
      entities: this._entities,
      sentiment: this._sentiment,
    };
  }
  appendToTweetList() {
    Tweet.redis.addTweet(this._coin.name.toLowerCase(), JSON.stringify(this.toJSON()));
    Tweet.redis.publishTweet(JSON.stringify(this.toJSON()));
  }
}
