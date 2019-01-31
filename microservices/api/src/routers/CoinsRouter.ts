import { Router } from 'express';
import RedisClient from '../RedisClient';
const redis = new RedisClient();
const router = Router();

// define the home page route
router.get('/all', async(req, res) => {
  const key = await redis.getAllCoins();
  res.send(key);
});

// define the home page route
router.post('/property', async ({ body }, res) => {
  const { coinID = '', property = '' } = body;
  const key = await redis.getKeyValue(`${coinID}_${property}`);
  res.json({ key });
});

export default router;
