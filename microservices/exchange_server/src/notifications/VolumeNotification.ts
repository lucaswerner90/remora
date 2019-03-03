import Notification from './Notification';

export default class VolumeNotification extends Notification {
  constructor(info = { coin: { id: '' }, data: {} }) {
    super(info);
    this.type = 'volume';
  }
}
