const scrapeAmazon =
require("../scrapers/amazonScraper");

const scrapeFlipkart =
require("../services/mockFlipkart");

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

const {
detectVariants,
extractVariantInfo
} = require("../services/variantService");


/* =========================
ACCESSORY FILTER
========================= */

function isAccessory(title){

const lower =
title.toLowerCase();

const keywords = [

"cover",
"case",
"tempered",
"protector",
"charger",
"cable",
"screen guard"

];

return keywords.some(k =>
lower.includes(k)
);

}


/* =========================
PRODUCT RELEVANCE
========================= */

function isRelevant(title,query){

const words =
query.toLowerCase().split(" ");

const t =
title.toLowerCase();

let matches = 0;

words.forEach(w=>{
if(t.includes(w)) matches++;
});

return matches >=
Math.ceil(words.length*0.6);

}


/* =========================
SEARCH CONTROLLER
========================= */

exports.searchProducts =
async (req,res)=>{

try{

const query =
req.query.query;

const selectedVariant =
req.query.variant;

if(!query){

return res.status(400)
.json({error:"Query missing"});

}


/* ===== CACHE ===== */

if(!selectedVariant){

const cached =
cache.get(query);

if(cached)
return res.json(cached);

}


/* ===== SCRAPE ===== */

const [amazonResults,flipkartResults] =
await Promise.all([
scrapeAmazon(query),
scrapeFlipkart(query)
]);

/* ===== FILTER ===== */

const filtered =
[
...amazonResults,
...flipkartResults
].filter(p=>

p.title &&
!isAccessory(p.title) &&
isRelevant(p.title,query)

);

if(filtered.length === 0){

return res.json({products:[]});

}


/* ===== VARIANT DETECTION ===== */

const variants =
detectVariants(filtered);

if(
variants.length > 1 &&
!selectedVariant
){

return res.json({

askVariant:true,
variants

});

}


/* ===== VARIANT FILTER ===== */

let variantFiltered =
filtered;

if(selectedVariant){

variantFiltered =
filtered.filter(p=>{

const v =
extractVariantInfo(p.title);

return v === selectedVariant;

});

}


/* ===== NORMALIZE ===== */

const normalized =
variantFiltered.map(normalizeProduct);


/* ===== GROUP ===== */

const grouped =
groupProducts(normalized);


const comparisonResults = [];


/* ===== RANK ===== */

grouped.forEach(group=>{

const products =
group.products;

if(!products) return;

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

let tag =
"Available";

if(p===cheapest)
tag="💰 Cheapest";

else if(p===highestRated)
tag="⭐ Highest Rated";

comparisonResults.push({

...p,
verdict:tag,
dealScore:score,
confidence:trust

});

});

});


const result = {

products:
comparisonResults

};


/* ===== CACHE ===== */

if(!selectedVariant)
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