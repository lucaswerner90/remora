import { Router } from 'express';
import RedisClient from '../RedisClient';
const redis = new RedisClient();
const router = Router();

// Returns the coins object containing all the info about the ones which are being used by the exchanges servers
router.get('/all', async(req, res) => {
  const key = await redis.getAllCoins();
  if (!key) {
    res.send({});
  } else {
    res.send(key);
  }
});

router.post('/notifications', async ({ body }, res) => {
  const { coinName = '' } = body;
  const key: any = await redis.getNotifications(coinName.trim());
  res.send({ value: key });
});
router.post('/tweets', async ({ body }, res) => {
  const { coinName = '' } = body;
  const key: any = await redis.getTweets(coinName.trim().toLowerCase());
  res.send({ value: key });
});

router.post('/news', async ({ body }, res) => {
  const { coinName = '' } = body;
  // ethereum_last_news
  const key = await redis.getNews(coinName.trim().toLowerCase());
  res.send({ value: key });
});

router.post('/property', async ({ body }, res) => {
  const { coinID = '', property = '' } = body;
  const key = await redis.getKeyValue(`${coinID}_${property}`);
  res.send({ value: key });
});

export default router;
