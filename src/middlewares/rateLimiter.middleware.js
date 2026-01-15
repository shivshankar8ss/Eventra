const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redis = require("../config/redis");

const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,      
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimiter;
