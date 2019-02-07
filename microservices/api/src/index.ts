const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 9000;

import UsersRouter from './routers/UsersRouter';
import CoinsRouter from './routers/CoinsRouter';
import ChatRouter from './routers/ChatRouter';

console.log(`API NODE_ENV = ${process.env.NODE_ENV}`);

let accessControlHeader = '';
if (process.env.NODE_ENV === 'test') {
  accessControlHeader = 'http://localhost:3000';
} else if (process.env.NODE_ENV === 'dev') {
  accessControlHeader = 'http://localhost:7500';
} else {
  accessControlHeader = process.env.PRODUCTION_ENV;
}

console.log(`API --> Access-Control-Allow-Origin header set to (disabled now): ${accessControlHeader}`);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', UsersRouter);
app.use('/api/coin', CoinsRouter);
app.use('/api/chat', ChatRouter);

app.listen(PORT, () => {
  console.log(`Remora API listening on port ${PORT}!`);
});
