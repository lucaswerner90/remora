import { Router } from 'express';

import Authorization from '../auth/Authorization';

const router = Router();

const cookieName = process.env.AUTH_COOKIE_NAME || 'remora_jwt_token';

router.post('/login', (req, res) => {
  // Asks the database if the user exists
  console.log(req);
  // Generate JWT
  const token = Authorization.generateJWT(req.body);
  res.cookie(cookieName, token);
  res.status(200).send({ message: 'ok' }).end();

});

router.post('/logout', (req, res) => {
  res.cookie(cookieName, undefined);
  res.status(200).json({ message: 'user logged out' });
});

export default router;
