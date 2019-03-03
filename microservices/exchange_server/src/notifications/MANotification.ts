import Notification from './Notification';

export default class MANotification extends Notification{
  constructor(info = { coin: { id: '' }, data: {} }) {
    super(info);
    this.type = 'macd';
  }
}
