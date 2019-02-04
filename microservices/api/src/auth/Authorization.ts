const secret = process.env.AUTH_SECRET || 'somesupermegasecretthing';
const cookieName = process.env.AUTH_COOKIE_NAME || 'remora_jwt_token';
const jwt = require('jsonwebtoken');

export default class Authorization {
  static isLoggedIn(req, res, next) {
    if (!req.cookies[cookieName]) {
      res.status(400).send({ message: 'User not authorized' });
    } else {
      next();
    }
  }

  static generateJWT(payload = { email: '', password: '' }) {
    return jwt.sign(payload, secret);
  }
}
