const express = require('express');
const compression = require('compression');
const next = require('next');
const cookieParser = require('cookie-parser');

const dev = true;
const app = next({ dev });


const cookieName = process.env.AUTH_COOKIE_NAME || 'remora_jwt_token';

// TODO: need to install cookieParser module
const isLoggedIn = (req, res, next) => {
  if (!req.cookies || !req.cookies[cookieName]) {
    res.writeHead(302, { Location: '/login' });
    res.end();
    res.finished = true;
  } else {
    next();
  }
};

app.prepare().then(() => {
  const server = express();
  
  server.use(express.static(__dirname + '/static'));
  server.use(cookieParser());
  server.get('/', (_req, res) => {
    res.sendFile(`${__dirname}/static/index.html`);
  });
  server.get('/dashboard', isLoggedIn, (req, res) => {
    return app.render(req, res, '/dashboard');
  });
  server.get('/login', (req, res) => {
    return app.render(req, res, '/login');
  });
  server.get('/signup', (req, res) => {
    return app.render(req, res, '/signup');
  });

  server.listen(80, (err) => {
    if (err) throw err;
    console.log('NextJS is ready on port 80!');
  })

}).catch((error) => {
  console.error(error.stack);
});