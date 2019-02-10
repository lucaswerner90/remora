import * as redis from 'redis';
const REDIS_CONFIGURATION = {
  host: 'redis',
  port: parseInt(process.env.REDIS_PORT) || 6379,
};
/**
 * Base class that is going to be used to create the mongoose database schemas
 *
 * @export
 * @class Schema
 */
export default abstract class Schema {

  private _channel: string;
  private _info: any;
  protected _writeOptions: any = { upsert: true, setDefaultsOnInsert: true, runValidators: true };
  protected static redis = redis.createClient(REDIS_CONFIGURATION);
  constructor(channel: string = '', message:any = {}) {
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
