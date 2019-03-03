import * as NewsAPI from 'newsapi';
import RedisClient from './RedisClient';
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

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
   * @type {number}
   * @memberof NewsAPIServer
   */
  // private intervalTimeout: number = 5 * 60 * 1000;

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
    this.redisClient.getAllCoins().then((coins) => {
      const coinsValues: any = Object.values(coins);
      for (let i = 0; i < coinsValues.length; i++) {
        const { name = '' } = JSON.parse(coinsValues[i]);
        this.getHeadlines(JSON.parse(coinsValues[i]), name.toLowerCase());
        setInterval(() => {
          this.getHeadlines(JSON.parse(coinsValues[i]), name.toLowerCase());
        }, 60 * 60 * 1000);
      }
    });
  }

  /**
   *
   *
   * @returns {Promise<INewsResponse>}
   * @memberof NewsAPIServer
   */
  public async getHeadlines(coin, coinName:string = '') {
    try {
      const response: INewsResponse = await newsapi.v2.everything({
        q: coinName,
        sources: 'fortune, abc-news, bloomberg, business-insider, cnbc, crypto-coins-news, engadget, financial-post, financial-times, hacker-news, the-economist',
        sortBy: 'relevance',
      });
      if (response.status === 'ok' && response.articles.length) {
        const existentNews = await this.redisClient.getNews(coinName);
        const { articles = [] } = response;
        const sentimentalArticles = articles
          .filter((article) => {
            if (existentNews.length > 0) {
              return existentNews.filter(existentNew => existentNew.publishedAt === article.publishedAt).length === 0;
            }
            return true;
          })
          .filter(article => article.title.toLowerCase().includes(coinName.toLowerCase()))
          .map(article => ({ ...article, sentiment: sentiment.analyze(article.description || article.title).score }));
        for (let i = 0; i < sentimentalArticles.length; i++) {
          const element = sentimentalArticles[i];
          this.redisClient.setLastNews(coinName.toLowerCase(), JSON.stringify({ coin, info: element }));
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

new NewsAPIServer();
