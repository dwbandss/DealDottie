const dealScore = require("../ai/dealScore");
const reviewTrust = require("../ai/reviewTrust");

function rankDeals(products){

if(!products || products.length === 0)
return [];

/* -------------------------
DATA CONTEXT
------------------------- */

const prices =
products.map(p => p.price || 0);

const avgPrice =
prices.reduce((a,b)=>a+b,0) / prices.length;

const minPrice =
Math.min(...prices);

/* -------------------------
RANKING
------------------------- */

const scored =
products
.filter(p => p.price > 0)
.map(p => {

const trust =
reviewTrust(p);

const score =
dealScore({
...p,
avgPrice,
minPrice
});

let verdict = "Good Option";

if(score > 85)
verdict = "🏆 Best Deal";

else if(score > 70)
verdict = "🔥 Great Value";

else if(score > 60)
verdict = "👍 Worth Buying";

/* Confidence model */

const confidence =
Math.min(
100,
Math.round(
(p.rating || 4) *
Math.log((p.reviews || 1)+1)
)
);

return {
...p,
dealScore: score,
confidence,
verdict
};

});

/* -------------------------
SORT
------------------------- */

return scored
.sort((a,b)=>b.dealScore-a.dealScore)
.slice(0,10);

}

module.exports = rankDeals;