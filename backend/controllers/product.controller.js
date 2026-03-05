const scrapeAmazon =
require("../scrapers/amazonScraper");

const scrapeFlipkart =
require("../scrapers/flipkartScraper");

const normalizeProduct =
require("../services/normalizeService");

const groupProducts =
require("../services/groupingService");

const cache =
require("../utils/cache");

const reviewTrust =
require("../ai/reviewTrust");

const dealScore =
require("../ai/dealScore");

const generateMarketplaceDeals =
require("../services/mockMarketplace");
const {
  cleanTitle,
  tokenize,
  similarityScore,
  isSameProduct
} = require("../services/productMatcher");
/* =========================
ACCESSORY FILTER
========================= */

function isAccessory(title){

const lower = title.toLowerCase();

const words = [
"cover",
"case",
"protector",
"charger",
"cable",
"tempered",
"screen guard"
];

return words.some(w => lower.includes(w));

}

/* =========================
SMART RELEVANCE FILTER
========================= */

function isRelevant(title,query){

const q = query.toLowerCase();
const t = title.toLowerCase();

const words = q.split(" ");

let score = 0;

words.forEach(w=>{
if(t.includes(w)) score++;
});

return score >= 1;

}

/* =========================
SEARCH CONTROLLER
========================= */

exports.searchProducts =
async (req,res)=>{

try{

const query =
req.query.query;

if(!query)
return res.status(400)
.json({error:"Query missing"});

/* ===== CACHE ===== */

const cached =
cache.get(query);

if(cached)
return res.json(cached);

/* ===== SCRAPE ===== */

const [amazonResults,flipkartResults] =
await Promise.all([
scrapeAmazon(query),
scrapeFlipkart(query)
]);

/* ===== MERGE ===== */

let combined = [...amazonResults];

amazonResults.forEach(p=>{

const mockDeals =
generateMarketplaceDeals(p);

combined.push(...mockDeals);

});

/* ===== FILTER ===== */

const filtered =
combined.filter(p => {

if(!p.title) return false;

if(isAccessory(p.title)) return false;

/* keyword relevance */
if(!isRelevant(p.title,query)) return false;

/* similarity identity check */
if(!isSameProduct(query,p.title)) return false;

return true;

});
if(filtered.length === 0)
return res.json({products:[]});

/* ===== NORMALIZE ===== */

const normalized =
filtered.map(normalizeProduct);

/* ===== GROUP PRODUCTS ===== */

const grouped =
groupProducts(normalized)
.filter(g => g.products && g.products.length > 0);
const results = [];

/* ===== RANK DEALS ===== */

grouped.forEach(group=>{

const products = group.products;

const cheapest =
[...products]
.sort((a,b)=>a.price-b.price)[0];

const highestRated =
[...products]
.sort((a,b)=>
(b.rating||0)-(a.rating||0)
)[0];

products.forEach(p=>{

const trust =
reviewTrust(p);

const score =
dealScore(p);

let verdict = "Available";

if(p === cheapest)
verdict = "💰 Cheapest";

else if(p === highestRated)
verdict = "⭐ Highest Rated";

results.push({

...p,
verdict,
dealScore:score,
confidence:trust

});

});

});

const result = {
products: results.slice(0,15)
};

/* ===== CACHE ===== */

cache.set(query,result);

return res.json(result);

}

catch(err){

console.error(
"Controller error:",
err.message
);

return res.status(500)
.json({
error:"Marketplace engine failed"
});

}

};