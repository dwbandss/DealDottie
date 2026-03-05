const axios = require("axios");
const axiosRetry = require("axios-retry").default;

const instance = axios.create({
  timeout: 15000
});

axiosRetry(instance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 503 ||
      error.response?.status === 429
    );
  }
});

module.exports = instance;