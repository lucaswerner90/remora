import * as redis from 'redis';
import { Express, Application } from 'express';

const PORT:number = parseInt(process.env.PORT) || 4500;

const REDIS_CONFIGURATION = {
  host: process.env.REDIS_HOST || 'localhost',
    // tslint:disable-next-line:radix
  port: parseInt(process.env.REDIS_PORT) || 6379,
};

/**
 *
 *
 * @class SocketIOServer
 */
class SocketIOServer {

  /**
   *
   *
   * @private
   * @memberof SocketIOServer
   */
  private ioServer;

  /**
   *
   *
   * @private
   * @type {redis.RedisClient}
   * @memberof SocketIOServer
   */
  private redisSubscriber: redis.RedisClient = redis.createClient(REDIS_CONFIGURATION);
  constructor() {
    const express: Express = require('express');
    const app: Application = express();
    const server = app.listen(PORT);
    this.ioServer = require('socket.io').listen(server);
    this.initConnection();
    this.initRedisSubscriber();
  }
  private initRedisSubscriber() {
    this.redisSubscriber.on('ready', () => {
      console.log('SocketIO redis publisher has been connected! :D ');
    });

    this.redisSubscriber.on('message', (channel, message) => {
      const messageParsed = JSON.parse(message);
      if (messageParsed.exchange) {
        const finalChannel = `${messageParsed.exchange}_${channel}`;
        this.ioServer.sockets.emit(finalChannel, messageParsed);
      } else {
        this.ioServer.sockets.emit(channel, messageParsed);
      }
    });

    this.redisSubscriber.subscribe('new_order');
    this.redisSubscriber.subscribe('volume_difference');
    this.redisSubscriber.subscribe('price_list');
    this.redisSubscriber.subscribe('last_news');
  }
  private initConnection() {
    console.log(`Listening on port: ${PORT}`);
    this.ioServer.on('connection', () => {
      console.log('New connection detected!');
    });
  }
}

new SocketIOServer();
