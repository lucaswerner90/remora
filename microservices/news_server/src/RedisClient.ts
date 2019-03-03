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

  /**
   *
   *
   * @private
   * @type {redis.RedisClient}
   * @memberof RedisClient
   */
  private clientPublisher: redis.RedisClient;

  /**
   *Creates an instance of RedisClient.
   * @memberof RedisClient
   */
  constructor() {
    this.client = redis.createClient(config.port, config.host);
    this.clientPublisher = redis.createClient(config.port, config.host);
    this.client.on('error', (err) => {
      console.log(`REDIS CLIENT ERROR: ${err}`);
      this.client = redis.createClient(config.port, config.host);
    });

  }
  public async getNews(coinName = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.lrange(`${coinName}_last_news`, 0, 19, (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply.map(article => JSON.parse(article)));
      });
    });
  }
  /**
   *
   *
   * @param {string} value
   * @memberof RedisClient
   */
  public setLastNews(coinName:string, value: string = '') {
    const key = `${coinName}_last_news`;
    this.clientPublisher.publish('last_news', value);
    const { info = {} } = JSON.parse(value);
    this.client.lpush(key, JSON.stringify(info), () => {
      this.client.ltrim(key, 0, 19);
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
}
