import * as redis from 'redis';
import CoinSchema from './schemas/CoinSchema';
import OrderSchema from './schemas/OrderSchema';
import MongoConnection from './db/MongoConnection';

const configJson = require('./../config/config.json');

const REDIS_CONFIGURATION = {
  host: 'redis',
  port: parseInt(process.env.REDIS_PORT) || 6379,
};

class DBServerConnection {

  private redis: redis.RedisClient = redis.createClient(REDIS_CONFIGURATION);

  private channelList: string[] = configJson.channelList;
  private _exchange: string = process.env.EXCHANGE || configJson.defaults.exchange;
  constructor() {
    new MongoConnection();
    this.initRedisSubscriber();
  }

  private initRedisSubscriber() {

    this.redis.on('ready', this.redisOnConnect.bind(this));
    this.redis.on('message', this.redisOnMessage.bind(this));

    for (let i = 0; i < this.channelList.length; i++) {
      this.redis.subscribe(this.channelList[i]);
    }
  }

  private redisOnConnect() {
    console.log(`Database server/redis has been connected to ${REDIS_CONFIGURATION.host}:${REDIS_CONFIGURATION.port} ...`);
  }

  private redisOnMessage(channel: string, message: string) {
    const messageParsed = JSON.parse(message);
    if (messageParsed.exchange === this._exchange) {
      switch (channel) {
        case 'order':
          new OrderSchema(channel, messageParsed);
          break;
        default:
          new CoinSchema(channel, messageParsed);
          break;
      }
    }
  }
}

new DBServerConnection();
