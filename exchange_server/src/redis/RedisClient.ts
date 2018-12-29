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
  private client:redis.RedisClient;
  private clientPublisher: redis.RedisClient;
  private static INSTANCE: RedisClient;
  constructor() {
    if (!RedisClient.INSTANCE) {
      this.client = redis.createClient(config.port, config.host);
      this.clientPublisher = redis.createClient(config.port, config.host);
      this.client.on('error', (err) => {
        console.log(`REDIS CLIENT ERROR: ${err}`);
        this.client = redis.createClient(config.port, config.host);
      });
      RedisClient.INSTANCE = this;
    }
    return RedisClient.INSTANCE;
  }

  public setVolumeDifferenceValue(key: string, value: string) {
    this.clientPublisher.publish('volume_difference', value);
    this.client.set(key, value);
  }
  public setLatestPrice(key: string, value: string) {
    this.clientPublisher.publish('latest_price', value);
    this.client.set(key, value);
  }
  public setPricesList(key: string, value: string) {
    this.clientPublisher.publish('price_list', value);
    this.client.set(key, value);
  }
  public setOrderValue(key: string, value: string) {
    this.clientPublisher.publish('new_order', value);
    this.client.set(key, value);
  }

  public async getOrderValue(key: string) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
  }
}
