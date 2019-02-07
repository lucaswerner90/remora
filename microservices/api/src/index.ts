const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 9000;

import UsersRouter from './routers/UsersRouter';
import CoinsRouter from './routers/CoinsRouter';
import ChatRouter from './routers/ChatRouter';
import AuthRouter from './routers/AuthRouter';

console.log(`API NODE_ENV = ${process.env.NODE_ENV}`);

const accessControlHeader = process.env.NODE_ENV === 'dev' ? 'http://localhost:7500' : process.env.PRODUCTION_ENV;
console.log(`API --> Access-Control-Allow-Origin header set to : ${accessControlHeader}`);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', accessControlHeader);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', AuthRouter);
app.use('/api/user', UsersRouter);
app.use('/api/coin', CoinsRouter);
app.use('/api/chat', ChatRouter);

app.listen(PORT, () => {
  console.log(`Remora API listening on port ${PORT}!`);
});
