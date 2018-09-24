const express = require("express");
const redis = require("redis");

const app = express();
const port = 3000;

const redisClient = redis.createClient(6379, "redis");

redisClient.on('connect', () => {
  app.get('/', (req, res) => res.send('Hello World!'));

  app.put('/thekey', (req, res, next) => {
    redisClient.set('thekey', req.query.value, (error, result) => {
      if (error) {
        next(err);
      } else {
        res.send("OK");
      }
    });
  });
  
  app.get('/thekey', (req, res, next) => {
    redisClient.get('thekey', (error, result) => {
      if (error) {
        next(err);
      } else {
        res.send(result);
      }
    });
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});

redisClient.on('error', (err) => {
  console.err(err);
  process.exit(1);
});