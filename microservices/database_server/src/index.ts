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

    if (messageParsed.coin && messageParsed.coin.exchange === this._exchange) {
      if (channel === 'order' || channel === 'db_order_event') {
        if (parseFloat(messageParsed.order.price) > 0 && messageParsed.order.id) {
          new OrderSchema(channel, messageParsed);
        }
      } else {
        new CoinSchema(channel, messageParsed);
      }
    }
  }
}

new DBServerConnection();
