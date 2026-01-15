const redis = require("../config/redis");

const acquireLock = async (key, ttl = 600) => {
  const result = await redis.set(key, "LOCKED", "NX", "EX", ttl);
  return result === "OK";
};

const releaseLock = async (key) => {
  await redis.del(key);
};

module.exports = { acquireLock, releaseLock };
