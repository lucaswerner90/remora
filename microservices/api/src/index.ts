const express = require('express');
const app = express();

import UsersRouter from './routers/UsersRouter';
import CoinsRouter from './routers/CoinsRouter';

app.use(express.json());

app.use('/api/user', UsersRouter);
app.use('/api/coin', CoinsRouter);

app.listen(9000, () => {
  console.log('Remora API listening on port 9000!');
});
