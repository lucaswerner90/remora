import * as redis from 'redis';
const config: redis.ClientOpts = {
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT) || 6379,
};

/**
 *
 *
 * @export
 * @class RedisClient
 */
export default class RedisClient {

  /**
   *
   *
   * @private
   * @type {redis.RedisClient}
   * @memberof RedisClient
   */
  private client: redis.RedisClient;
  private clientPublisher: redis.RedisClient;

  /**
   *Creates an instance of RedisClient.
   * @memberof RedisClient
   */
  constructor() {
    this.client = redis.createClient(config.port, config.host);
    this.clientPublisher = redis.createClient(config.port, config.host);
    this.clientPublisher.on('error', (err) => {
      console.log(`REDIS CLIENT ERROR: ${err}`);
      this.clientPublisher = redis.createClient(config.port, config.host);
    });
    this.client.on('error', (err) => {
      console.log(`REDIS CLIENT ERROR: ${err}`);
      this.client = redis.createClient(config.port, config.host);
    });
  }
  public async getAllCoins(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.hgetall('coins', (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
  }
  public publishTweet(value: string = '') {
    this.clientPublisher.publish('tweets', value);
  }
  public addTweet(coin: string = '', value: string = '') {
    this.client.lpush(`${coin.toLowerCase()}_tweets`, value);
  }
}
