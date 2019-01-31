import { Router } from 'express';

const router = Router();

const exampleUserInfo = {
  userPreferences: {
    selectedCoin: 'binance_ETHUSDT',
    favorites: ['binance_ETHUSDT', 'binance_BTCUSDT'],
    notifications: {},
  },
  userInfo: {
    name: 'Lucas Werner',
    email: 'wernerlucas12@gmail.com',
    isPremium: true,
  },
};

router.get('/', (req, res) => {
  res.json({ info: 'User router is working' });
});

router.post('/info', ({ body = {} }, res) => {
  res.json(exampleUserInfo.userInfo);
});

router.post('/preferences', ({ body = {} }, res) => {
  res.json(exampleUserInfo.userPreferences);
});

export default router;
