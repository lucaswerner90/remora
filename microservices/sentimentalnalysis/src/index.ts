import Tweet from './twitter/Tweet';

const twit = require('twit');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

import RedisClient from './RedisClient';
const redis = new RedisClient();

const TWITTER_COUNT = process.env.TWITTER_COUNT || 20;
const CONSUMER_KEY = 'KVVfaGtGPfQjGnEpFCA12IOBQ';
const CONSUMER_SECRET = 'zd9j53mbUtlqV92wFamwGeLr6vEIKwccJiy4XQijXWOyPRqou5';
const ACCESS_TOKEN = '1895974922-AKZWaJxUwXE8B71G5P6tNWhBn64yJzTtJuSXrKs';
const ACCESS_TOKEN_SECRET = '4inxJxWW33tEkLaLf1x4Xf6huiPCTGKEJ91XDTGdBHzka';

const config_twitter = {
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token: ACCESS_TOKEN,
  access_token_secret: ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
};
const api = new twit(config_twitter);

const initTwitterStream = (coin = { name:'' }, name = '') => {
  api.get('search/tweets', { q: `${name.toLowerCase()}`, count: TWITTER_COUNT, language: 'en', tweet_mode: 'extended' }, (err, data, response) => {
    const tweets = data.statuses;
    for (let i = 0; i < tweets.length; i++) {
      const tweet = tweets[i];
      const text = tweet.retweeted_status && tweet.retweeted_status.full_text ? tweet.retweeted_status.full_text : tweet.full_text;
      const { user = {}, created_at = '', lang = '', id } = tweet.retweeted_status ? tweet.retweeted_status : tweet;
      const { screen_name = '', location = '', url = '', profile_image_url = '', followers_count = 0 } = user;
      if (followers_count > 20000 && lang === 'en') {
        const twit = new Tweet(id, coin, text, { screen_name, location, url, profile_image_url, followers_count }, sentiment.analyze(text).score, created_at);
        twit.appendToTweetList();
      }
    }

    const stream = api.stream('statuses/filter', { track: `${name}`, language: 'en' });

    stream.on('tweet', (tweet) => {
      const text = tweet.retweeted_status && tweet.retweeted_status.extended_tweet && tweet.retweeted_status.extended_tweet.full_text ? tweet.retweeted_status.extended_tweet.full_text : tweet.text ;
      const { user = {}, created_at = '', lang = '', id = 0 } = tweet.retweeted_status ? tweet.retweeted_status : tweet;
      const { screen_name = '', location = '', url = '', profile_image_url = '', followers_count = 0 } = user;

      if (followers_count > 20000 && lang === 'en') {
        const twit = new Tweet(id, coin, text, { screen_name, location, url, profile_image_url, followers_count }, sentiment.analyze(text).score, created_at);
        twit.publishToRedis();
      }
    });
  });
};

redis.getAllCoins().then((coins) => {
  const coinsValues: any = Object.values(coins);
  for (let i = 0; i < coinsValues.length; i++) {
    const { name = '' } = JSON.parse(coinsValues[i]);
    initTwitterStream(JSON.parse(coinsValues[i]), name);
  }
});
