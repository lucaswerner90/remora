import Tweet from './twitter/Tweet';

import RedisClient from './RedisClient';
const redis = new RedisClient();

const twit = require('twit');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const TWITTER_COUNT = process.env.TWITTER_COUNT || 20;
const CONSUMER_KEY = 'KVVfaGtGPfQjGnEpFCA12IOBQ';
const CONSUMER_SECRET = 'zd9j53mbUtlqV92wFamwGeLr6vEIKwccJiy4XQijXWOyPRqou5';
const ACCESS_TOKEN = '1895974922-AKZWaJxUwXE8B71G5P6tNWhBn64yJzTtJuSXrKs';
const ACCESS_TOKEN_SECRET = '4inxJxWW33tEkLaLf1x4Xf6huiPCTGKEJ91XDTGdBHzka';

const COIN_PROFILES = {
  ethereum: 'ethereum',
  bitcoin: 'bitcoin',
  ripple: 'Ripple',
  'binance coin': 'binance',
  litecoin: 'satoshilite',
  tron: 'tronfoundation',
  eos: 'block_one_',
  'ethereum classic':'eth_classic',
  fetchai: 'fetch_ai',
  bittorrent: 'BitTorrent',
  icon: 'helloiconworld',
};

const config_twitter = {
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token: ACCESS_TOKEN,
  access_token_secret: ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
};
const api = new twit(config_twitter);

const initTwitterStream = (coin = { name: '' }, account = '') => {
  api.get('statuses/user_timeline', { screen_name: account, count: TWITTER_COUNT, language: 'en', tweet_mode: 'extended', result_type: 'recent' }, (err, data, response) => {
    const tweets: any[] = data || [];
    for (let i = 0; i < tweets.length; i++) {
      const tweet = tweets[i];
      const { user = {}, created_at = '', id_str = '', entities = { urls:[] } } = tweet.retweeted_status ? tweet.retweeted_status : tweet;
      const text = tweet.retweeted_status && tweet.retweeted_status.full_text ? tweet.retweeted_status.full_text : tweet.full_text;
      const { screen_name = '', location = '', url = '', profile_image_url = '', followers_count = 0 } = user;
      const twit = new Tweet(id_str, coin, text, entities, { screen_name, location, url, profile_image_url, followers_count }, sentiment.analyze(text).score, created_at);
      twit.appendToTweetList();
    }
  });
};

redis.getAllCoins().then((allCoins) => {
  const coins = Object.values(allCoins);
  for (let i = 0; i < coins.length; i++) {
    const coin:any = coins[i];
    const parsedCoin = JSON.parse(coin);
    initTwitterStream(parsedCoin, COIN_PROFILES[parsedCoin.name.toLowerCase()]);
    setInterval(() => {
      initTwitterStream(parsedCoin, COIN_PROFILES[parsedCoin.name.toLowerCase()]);
    }, 10 * 60 * 1000);
  }
});
initTwitterStream({ name:'' }, 'fetch_ai');
