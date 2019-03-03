import Notification from './Notification';

export default class PriceDifferenceNotification extends Notification {
  constructor(info = { coin: { id: '' }, data: {} }) {
    super(info);
    this.type = 'price_difference';
  }
}
