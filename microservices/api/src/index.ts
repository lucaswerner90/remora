const express = require('express');
const app = express();

import UsersRouter from './routers/UsersRouter';
import CoinsRouter from './routers/CoinsRouter';
import ChatRouter from './routers/ChatRouter';

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());

app.use('/api/user', UsersRouter);
app.use('/api/coin', CoinsRouter);
app.use('/api/chat', ChatRouter);

app.listen(9000, () => {
  console.log('Remora API listening on port 9000!');
});
