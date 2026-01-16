const { Queue } = require("bullmq");
const bullRedis = require("../config/bullmq.redis");

const emailQueue = new Queue("email-queue", {
  connection: bullRedis,
});

module.exports = emailQueue;
