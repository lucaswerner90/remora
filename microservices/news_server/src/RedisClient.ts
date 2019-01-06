import * as redis from 'redis';
const config: redis.ClientOpts = {
  host: process.env.REDIS_HOST || '127.0.0.1',
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

  /**
   *
   *
   * @param {string} value
   * @memberof RedisClient
   */
  public setLastNews(value: string) {
    const key = 'last_news';
    this.clientPublisher.publish(key, value);
    this.client.set(key, value);
  }
}
