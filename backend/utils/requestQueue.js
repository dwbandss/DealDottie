const PQueue = require("p-queue").default;

const queue = new PQueue({
  concurrency: 2,
  interval: 1000,
  intervalCap: 2
});

module.exports = queue;