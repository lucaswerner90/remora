const { mongoDBConnection } = require('../../config/config.json');
const mongoose = require('mongoose');

export default class MongoConnection {
  private _host: string = mongoDBConnection.host;
  private _port: string = mongoDBConnection.port;
  private _databaseName: string = mongoDBConnection.name;
  private _user: string = mongoDBConnection.user;
  private _password: string = mongoDBConnection.password;
  private _extraParams: any = { useNewUrlParser: true };

  constructor() {
    mongoose.connect(`mongodb://${this._user}:${this._password}@${this._host}:${this._port}/${this._databaseName}`, this._extraParams);
    const db = mongoose.connection;
    db.on('error', this.onError.bind(this));
    db.once('open', this.onOpen.bind(this));
  }

  private onError(error) {
    console.error(error);
  }
  private onOpen() {
    console.log(`Connected to Mongo DB at ${this._host}:${this._port} to ${this._databaseName} database...`);
  }
}
