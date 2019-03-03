import RedisClient from '../redis/RedisClient';

type TNotificationType = 'volume' | 'macd' | 'order' | 'price_difference';
type TNotificationInfo = {
  coin: {
    id:string,
  },
  data: any,
};
const redis: RedisClient = new RedisClient();

export default class Notification{
  protected type: TNotificationType;
  protected info: TNotificationInfo;
  protected createdAt: number = Date.now();
  constructor(info: TNotificationInfo) {
    this.createdAt = Date.now();
    this.info = info;
  }
  toJSON() {
    return { ...this.info, type: this.type, createdAt: this.createdAt };
  }
  sendNotification() {
    redis.sendNotification(JSON.stringify(this.toJSON()), this.info.coin.id);
  }
}
