const mongoDBConnection = {
  host:'ds157223.mlab.com',
  port:'57223',
  name:'remora_users',
  user:'remora',
  password:'remora.1990',
};

const mongoose = require('mongoose');

export default class MongoConnection {
  private _host: string = mongoDBConnection.host;
  private _port: string = mongoDBConnection.port;
  private _databaseName: string = mongoDBConnection.name;
  private _user: string = mongoDBConnection.user;
  private _password: string = mongoDBConnection.password;
  private _extraParams: any = { useNewUrlParser: true };
  onOpen: () => void;

  constructor(openCallback = () => { }) {
    this.onOpen = openCallback;
  }
  public connect() {
    mongoose.connect(`mongodb://${this._user}:${this._password}@${this._host}:${this._port}/${this._databaseName}`, this._extraParams);
    const db = mongoose.connection;
    db.on('error', this.onError.bind(this));
    db.once('open', this.onOpen.bind(this));
  }
  public onError(error) {
    console.error(error);
  }
}
