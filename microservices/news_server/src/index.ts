import * as NewsAPI from 'newsapi';
import RedisClient from './RedisClient';
import * as fastJSON from 'fast-json-stringify';

const newsapi = new NewsAPI('148617c833c4406c80320ba99a8b6770');

/**
 *
 *
 * @interface IArticle
 */
interface IArticle {
  source: {
    id: null | string,
    name: string,
  };
  author: null | string;
  title: string;
  description: null | string;
  url: string;
  urlToImage: null | string;
  publishedAt: string;
  content: null | string;
}

/**
 *
 *
 * @interface INewsResponse
 */
interface INewsResponse {
  status: string;
  totalResults: number;
  articles: IArticle[];
}

/**
 *
 *
 * @export
 * @class NewsAPIServer
 */
export default class NewsAPIServer {

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof NewsAPIServer
   */
  private keywords: string = 'ethereum,bitcoin,cryptocurrency,blockchain,litecoin,ripple';

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof NewsAPIServer
   */
  private intervalTimeout: number = 5 * 60 * 1000;

  /**
   *
   *
   * @private
   * @type {RedisClient}
   * @memberof NewsAPIServer
   */
  private redisClient: RedisClient = new RedisClient();

  /**
   *Creates an instance of NewsAPIServer.
   * @memberof NewsAPIServer
   */
  constructor() {
    setInterval(async () => {
      try {
        const response = await this.getHeadlines();
        if (response.status === 'ok' && response.articles.length) {
          this.redisClient.setLastNews(JSON.stringify(response.articles));
        }
      } catch (error) {

      }
    }, this.intervalTimeout);
  }

  /**
   *
   *
   * @returns {Promise<INewsResponse>}
   * @memberof NewsAPIServer
   */
  public async getHeadlines(): Promise<INewsResponse> {
    try {
      const response: INewsResponse = await newsapi.v2.topHeadlines({ q: this.keywords });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

new NewsAPIServer();
