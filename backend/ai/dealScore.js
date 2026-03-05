const reviewTrust =
require("./reviewTrust");

const dealHeat =
require("./dealHeat");

function dealScore(product){

const heat =
dealHeat(product);

const trust =
reviewTrust(product);

const score =
heat*0.7 + trust*0.3;

return Math.round(score);

}

module.exports = dealScore;