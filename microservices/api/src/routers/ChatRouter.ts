import { Router } from 'express';
import RedisClient from '../RedisClient';
const redis = new RedisClient();
const router = Router();

router.post('/messages', async ({ body }, res) => {
  const { chat = '' } = body;
  const key = await redis.getChatMessages(chat);
  res.json({ messages: key.filter(message => message !== '[object Object]').map(message => JSON.parse(message)) });
});

export default router;
