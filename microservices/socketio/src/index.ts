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
  private redisSubscriber: redis.RedisClient = redis.createClient(REDIS_CONFIGURATION);

  private channelList: string[] = configJson.channelList;

  constructor() {
    this.initConnection();
    this.initRedisSubscriber();
  }

  private initRedisSubscriber() {

    this.redisSubscriber.on('ready', this.redisOnConnect.bind(this));
    this.redisSubscriber.on('message', this.redisOnMessage.bind(this));

    for (let i = 0; i < this.channelList.length; i++) {
      this.redisSubscriber.subscribe(this.channelList[i]);
    }
  }
  private initConnection() {
    console.log(`Listening on port: ${PORT}`);
    this.ioServer.on('connection', () => {
      console.log('New connection detected!');
    });
  }

  private redisOnConnect() {
    console.log('SocketIO redis publisher has been connected! :D ');
  }

  private redisOnMessage(channel:string, message:string) {
    const messageParsed = JSON.parse(message);
    messageParsed.type = channel;
    if (messageParsed.exchange) {
      const finalChannel = `${messageParsed.exchange}_${messageParsed.symbol || messageParsed.name}`;

      let finalData: any = {};
      switch (messageParsed.type) {
        case 'latest_price':
          finalData = { price: messageParsed.price };
          break;
        case 'price_change_24hr':
          finalData = { price: messageParsed.price };
          break;
        case 'price_list':
          finalData = { pricesList: messageParsed.prices };
          break;
        case 'order':
          finalData = { id: messageParsed.id, ...messageParsed.details };
          break;
        case 'volume_difference':
          finalData = { tendency: messageParsed.tendency, volumeDifference: messageParsed.currentVolumeDifference };
          break;
        default:
          break;
      }
      this.ioServer.sockets.emit(finalChannel, { type: messageParsed.type, info: finalData });

    }
  }
}

new SocketIOServer();
