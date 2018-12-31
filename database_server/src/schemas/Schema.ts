import * as mongoose from 'mongoose';

export default class Schema {

  private _channel: string;
  private _info: any;
  protected _writeOptions: any = { upsert: true, setDefaultsOnInsert: true, runValidators: true };
  constructor(channel: string = '', message:any = {}, schema: any = {}, modelName:string = '') {
    this._channel = channel;
    this._info = message;
  }
  public get channel() {
    return this._channel;
  }
  public get info() {
    return this._info;
  }

  writeToDB(): any {
    throw new Error('writeToDB Method must be implemented in the child classes.');
  }
}
