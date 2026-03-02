const axios = require("axios");
const rankDeals = require("../ai/dealRanker");
const normalizeQuery = require("../ai/queryBrain");
const filterProducts = require("../ai/productMatcher");

exports.searchProducts = async (req, res) => {

try {

const rawQuery = req.query.query;

if (!rawQuery)
return res.status(400).json({
error: "Query missing"
});

/* ======================
QUERY NORMALIZATION
====================== */

const query = normalizeQuery(rawQuery);

/* ======================
VARIANT DETECTION
====================== */

const variants = ["pro","plus","pro max","max"];

const foundVariants =
variants.filter(v =>
rawQuery.toLowerCase().includes(v)
);

/* Ask variant ONLY if user didn't specify */
if(foundVariants.length === 0 &&
query.includes("iphone")){

return res.json({
askVariant:true,
variants:["Pro","Plus","Pro Max"]
});
}

/* ======================
REAL MARKETPLACE API
====================== */

const response = await axios.get(
"https://serpapi.com/search.json",
{
params:{
engine:"google_shopping",
q:rawQuery,
api_key:process.env.SERP_API_KEY
}
});

const results =
response.data.shopping_results || [];

if(results.length === 0){
return res.json({ products: [] });
}

/* ======================
FORMAT PRODUCTS
====================== */

const products = results.map(p => ({

title:p.title,
price:parseInt(
p.price?.replace(/[^\d]/g,"")
) || 0,

rating:p.rating || 4,
reviews:p.reviews || 0,
seller:p.source || "Unknown",
image:p.thumbnail
}));

/* ======================
AI MATCH FILTER
====================== */

const filtered =
filterProducts(products, rawQuery);

/* ======================
AI RANK ENGINE
====================== */

const ranked =
rankDeals(filtered);

/* ======================
FINAL RESPONSE
====================== */

return res.json({
products: ranked
});

}
catch(err){

console.error("SEARCH ENGINE ERROR:",err.message);

/* IMPORTANT — ALWAYS RESPOND */
return res.status(500).json({
error:"Marketplace engine failed"
});
}
};