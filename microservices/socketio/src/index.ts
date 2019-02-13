import * as redis from 'redis';
import * as express from 'express';
import * as socketIo from 'socket.io';

const configJson = require('./../config/config.json');
const PORT:number = parseInt(process.env.PORT) || 5000;

const REDIS_CONFIGURATION = {
  host: 'redis',
  port: parseInt(process.env.REDIS_PORT) || 6379,
};

const app: express.Express = express();
const server = app.listen(PORT);
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
  private ioServer = socketIo.listen(server);

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
    this.initConnection();
    this.initRedisSubscriber();
  }

  public async getAllCoins(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.redisClient.hgetall('coins', (err, reply) => {
        if (err) {
          reject(err);
        }
        console.log(reply);
        resolve(reply);
      });
    });
  }
  private initRedisSubscriber() {

    this.redisSubscriber.on('ready', this.redisOnConnect.bind(this));
    this.redisSubscriber.on('message', this.redisOnMessage.bind(this));
    for (let i = 0; i < this.channelList.length; i++) {
      this.redisSubscriber.subscribe(this.channelList[i]);
    }
  }
  private initConnection() {
    this.ioServer.on('connection', (socket) => {
      this.initChat(socket);
    });
  }

  private async initChat(socket:socketIo.Socket) {
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
  }

  private redisOnMessage(channel:string, message:string) {
    const messageParsed = JSON.parse(message);
    if (messageParsed.coin && messageParsed.coin.exchange) {
      const finalChannel = messageParsed.coin.id;
      let finalData: any = {};
      switch (channel) {
        case 'count_orders':
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
        case 'order':
          finalData = messageParsed;
          break;
        case 'previous_order':
          finalData = messageParsed;
          break;
        case 'mean_order_value':
          finalData = messageParsed;
          break;
        case 'volume_difference':
          finalData = { volumeDifference: messageParsed.volumeDifference };
          break;
        default:
          break;
      }
      this.ioServer.sockets.emit(finalChannel, { message: channel, info: finalData });
      this.ioServer.sockets.emit(`${finalChannel}_${channel}`, { message: channel, info: finalData });

    }
  }
}

new SocketIOServer();
