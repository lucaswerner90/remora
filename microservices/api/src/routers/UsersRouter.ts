import { Router, response } from 'express';
import UserSchema from '../db/schemas/UserSchema';
import { Mongoose } from 'mongoose';

const router = Router();

const initialInfo = {
  selectedCoin: 'binance_ETHUSDT',
  favorites: ['binance_ETHUSDT', 'binance_BTCUSDT'],
  isPremium: false,
};

router.post('/selected', async (req, res) => {
  try {
    const { email = '', payload = '' } = req.body;
    console.log(`Saving selected coin for ${email} user`);
    // Payload contains the new selected coin
    // Write the new info into the DB
    const user = new UserSchema();
    const reply = await user.writeUserSelectedCoin(email, { selected: payload });
    res.json({ message: reply });

  } catch (error) {
    res.json({ error });
  }
});

router.post('/favorites', async (req, res) => {
  try {
    const { email = '', payload:favorites = [] } = req.body;
    console.log(`Saving favorite coins for ${email} user: ${favorites}`);

    // Write the new info into the DB
    const user = new UserSchema();
    await user.writeUserFavorites(email, { favorites });
    res.json({ message: 'saved' });

  } catch (error) {
    res.json({ error });
  }
});

router.get('/preferences', async(req, res) => {
  const { email = '' } = req.query;
  const user = new UserSchema();
  const document = await user.getUser(email);
  if (!document) {
    const newUser = await user.createNewUser(email);
    res.json(newUser);
  }else {
    res.json(document);
  }
});

export default router;
