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

// define the home page route
router.post('/tweets', async ({ body }, res) => {
  const { coinID = '' } = body;
  const key:any = await redis.getLastTweets(coinID);
  res.send({ value: key.map(tweet => JSON.parse(tweet)) });
});
// define the home page route
router.post('/property', async ({ body }, res) => {
  const { coinID = '', property = '' } = body;
  const key = await redis.getKeyValue(`${coinID}_${property}`);
  res.send({ value: key });
});

export default router;
