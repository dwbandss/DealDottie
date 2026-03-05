const { HttpsProxyAgent } = require("https-proxy-agent");

const proxyList = [
  "http://username:password@proxy1:port",
  "http://username:password@proxy2:port",
  "http://username:password@proxy3:port"
];

function getRandomProxy() {
  return null; // Disable proxy usage for now
}

module.exports = getRandomProxy;