import * as redis from 'redis';

const config: redis.ClientOpts = {
  host: 'redis',
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
  public sendNotification(value:string, coinID:string) {
    this.clientPublisher.publish('notifications', value);
    this.client.lpush(`${coinID}_notifications`, value, () => {
      this.client.ltrim(`${coinID}_notifications`, 0, 99);
    });
  }
  public setVolumeDifferenceValue(key: string, value: string) {
    this.clientPublisher.publish('volume_difference', value);
    this.client.set(key, value);
  }
  public setLatestPrice(key: string, value: string) {
    this.clientPublisher.publish('latest_price', value);
    this.client.set(key, value);
  }
  public setMACDDifference(key: string, value: string) {
    this.clientPublisher.publish('macd_difference', value);
    this.client.set(key, value);
  }
  public setPricesList1min(key: string, value: string) {
    this.clientPublisher.publish('price_list_1min', value);
    this.client.set(key, value);
  }
  public setPricesList5min(key: string, value: string) {
    this.clientPublisher.publish('price_list_5min', value);
    this.client.set(key, value);
  }
  public setPricesList15min(key: string, value: string) {
    this.clientPublisher.publish('price_list_15min', value);
    this.client.set(key, value);
  }
  public setPricesList1hour(key: string, value: string) {
    this.clientPublisher.publish('price_list_1hour', value);
    this.client.set(key, value);
  }
  public setPricesList2hour(key: string, value: string) {
    this.clientPublisher.publish('price_list_2hour', value);
    this.client.set(key, value);
  }
  public setPreviousOrderValue(key: string, value: string) {
    this.clientPublisher.publish('previous_order', value);
    this.client.set(key, value);
  }
  public setOrderValue(key: string, value: string) {
    if (JSON.parse(value).order.price !== undefined) {
      this.setPreviousOrderValue(`${key}_previous`, value);
    }
    this.clientPublisher.publish('order', value);
    this.client.set(key, value);
  }
  public setMeanOrderValue(key: string, value: string) {
    this.clientPublisher.publish('mean_order_value', value);
    this.client.set(key, value);
  }
  public setPriceChange(key: string, value: string) {
    this.clientPublisher.publish('price_change_24hr', value);
    this.client.set(key, value);
  }
  public appendCoin(value) {
    this.client.hset('coins', value.id, JSON.stringify(value));
  }
  public async updateOrderEvents(value:string) {
    this.clientPublisher.publish('db_order_event', value);
  }

  public async getKeyValue(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(reply));
      });
    });
  }
}
