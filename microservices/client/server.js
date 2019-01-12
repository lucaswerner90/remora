const express = require('express');
const compression = require('compression');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.static(__dirname + '/static'));
  server.use(compression());
  server.get('/', (req, res) => {
    res.sendFile(`${__dirname}/static/index.html`);
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('NextJS is ready on port 3000!');
  })

}).catch((error) => {
  console.error(error.stack);
});