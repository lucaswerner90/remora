import { Router } from 'express';

const router = Router();

const exampleUserInfo = {
  userPreferences: {
    selectedCoin: 'binance_ETHUSDT',
    favorites: ['binance_ETHUSDT', 'binance_BTCUSDT'],
    notifications: {},
  },
  userInfo: {
    password: 'test',
    name: 'Lucas Werner',
    username: 'lucaswerner',
    email: 'wernerlucas12@gmail.com',
    isPremium: true,
  },
};

router.post('/info', (_req, res) => {
  res.json(exampleUserInfo.userInfo);
});

router.post('/preferences', (_req, res) => {
  res.json(exampleUserInfo.userPreferences);
});

export default router;
