const Redis = require("ioredis");

let redisClient;

const connectRedis = () => {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
    console.log("Redis Connected");
  }
  return redisClient;
};

module.exports = connectRedis;
