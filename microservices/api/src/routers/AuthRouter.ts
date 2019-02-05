import { Router } from 'express';

import Authorization from '../auth/Authorization';

const router = Router();

const cookieName = process.env.AUTH_COOKIE_NAME || 'remora_jwt_token';

router.post('/login', ({ body }, res) => {
  if (!body) {
    res.status(400).send({ error: 'No email nor password provided' });
  }
  // Asks the database if the user exists
  // Generate JWT
  const token = Authorization.generateJWT(body);
  res.cookie(cookieName, token);
  res.status(200).send({ message: 'ok' });

});

router.post('/logout', (req, res) => {
  res.cookie(cookieName, undefined);
  res.status(200).json({ message: 'user logged out' });
});

export default router;
