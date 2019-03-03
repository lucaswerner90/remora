import * as redis from 'redis';
const configJson = require('./../config/config.json');
const PORT:number = parseInt(process.env.PORT) || 5000;

const REDIS_CONFIGURATION = {
  host: 'redis',
  port: parseInt(process.env.REDIS_PORT) || 6379,
};
/**
 *
 *
 * @class SocketIOServer
 */
class SocketIOServer {

  /**
   *
   *
   * @private
   * @memberof SocketIOServer
   */
  private ioServer = require('socket.io')({ transports:['pooling'] });

  /**
   *
   *
   * @private
   * @type {redis.RedisClient}
   * @memberof SocketIOServer
   */
  private redisClient: redis.RedisClient = redis.createClient(REDIS_CONFIGURATION);
  private redisSubscriber: redis.RedisClient = redis.createClient(REDIS_CONFIGURATION);
  private redisPublisher: redis.RedisClient = redis.createClient(REDIS_CONFIGURATION);

  private channelList: string[] = configJson.channelList;

  constructor() {
    this.ioServer.on('connection', (socket) => {
      this.initChat(socket);
    });
    this.initRedisSubscriber();
    this.ioServer.listen(PORT);
  }

  public async getAllCoins(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.redisClient.hgetall('coins', (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
  }
  private initRedisSubscriber() {
    console.log('Initializing redis suscriber...');
    this.redisSubscriber.on('ready', this.redisOnConnect.bind(this));
  }

  private async initChat(socket) {
    const coins = await this.getAllCoins();
    const coinsID = Object.keys(coins);
    for (let i = 0; i < coinsID.length; i++) {
      socket.on(`${coinsID[i]}_chat`, (msg) => {
        this.redisPublisher.rpush(`${coinsID[i]}_chat_messages`, JSON.stringify(msg));
        this.ioServer.emit(`${coinsID[i]}_chat`, msg);
      });
    }
  }

  private redisOnConnect() {
    console.log('SocketIO redis publisher has been connected! :D ');
    this.redisSubscriber.on('message', this.redisOnMessage.bind(this));
    for (let i = 0; i < this.channelList.length; i++) {
      this.redisSubscriber.subscribe(this.channelList[i]);
    }
  }

  private redisOnMessage(channel:string, message:string) {
    const messageParsed = JSON.parse(message);
    if (messageParsed.coin && messageParsed.coin.id) {
      const finalChannel = messageParsed.coin.id;
      let finalData: any = {};
      switch (channel) {
        case 'last_news':
          finalData = messageParsed.info;
          break;
        case 'notifications':
          finalData = messageParsed;
          break;
        case 'macd_difference':
        case 'tweets':
        case 'order':
        case 'previous_order':
          finalData = messageParsed;
          break;
        case 'latest_price':
          finalData = { price: messageParsed.price };
          break;
        case 'price_change_24hr':
          finalData = { price: messageParsed.price };
          break;
        case 'price_list_1min':
        case 'price_list_5min':
        case 'price_list_15min':
        case 'price_list_1hour':
        case 'price_list_2hour':
          finalData = { pricesList: messageParsed.prices };
          break;
        case 'volume_difference':
          finalData = { volumeDifference: messageParsed.volumeDifference };
          break;
        default:
          break;
      }
      if (channel === 'tweets' || channel === 'last_news') {
        const globalChannel = `${messageParsed.coin.name.toLowerCase()}_${channel}`;
        this.ioServer.emit(globalChannel, { info: finalData });
      } else {
        this.ioServer.emit(`${finalChannel}_${channel}`, { message: channel, info: finalData });
      }
    }
  }
}

new SocketIOServer();
