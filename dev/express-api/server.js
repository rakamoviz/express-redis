const express = require("express");
const redis = require("redis");

const app = express();
const port = 3000;

const redisClient = redis.createClient(6379, "redis", {
  retry_strategy: function (options) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with
          // a individual error
          return new Error('The server refused the connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands
          // with a individual error
          return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
          // End reconnecting with built in error
          return undefined;
      }
      // reconnect after
      return Math.min(options.attempt * 100, 3000);
  }
});

redisClient.auth(process.env.REDIS_PASSWORD);

redisClient.on('connect', () => {
  app.get('/', (req, res) => res.send('Hello World!'));

  app.put('/entry', (req, res, next) => {
    redisClient.set(process.env.ENTRY_KEY, req.query.value, (error, result) => {
      if (error) {
        next(err);
      } else {
        res.send("OK");
      }
    });
  });
  
  app.get('/entry', (req, res, next) => {
    redisClient.get(process.env.ENTRY_KEY, (error, result) => {
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