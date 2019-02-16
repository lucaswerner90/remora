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
   *Creates an instance of RedisClient.
   * @memberof RedisClient
   */
  constructor() {
    this.client = redis.createClient(config.port, config.host);
    this.client.on('error', (err) => {
      console.log(`REDIS CLIENT ERROR: ${err}`);
      this.client = redis.createClient(config.port, config.host);
    });
  }

  public async getKeyValue(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.get(key.trim(), (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(reply));
      });
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
  public async getTweets(coinName = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.lrange(`${coinName}_tweets`, 0, 20, (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
  }
  public async getChatMessages(chat = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.lrange(`${chat}_messages`, 0, 20, (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
  }
}
