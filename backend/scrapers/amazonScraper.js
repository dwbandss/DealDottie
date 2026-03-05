const axios = require("../utils/httpClient");
const cheerio = require("cheerio");

const queue = require("../utils/requestQueue");
const getRandomProxy = require("../utils/proxyPool");
const getRandomUserAgent = require("../utils/userAgents");

async function scrapeAmazon(query){

try{

const url =
`https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

const agent = getRandomProxy();

const options = {

headers:{
"User-Agent": getRandomUserAgent(),
"Accept-Language":"en-IN,en;q=0.9"
},

timeout:15000

};

if(agent){
options.httpsAgent = agent;
}

const response =
await queue.add(()=>axios.get(url,options));

const html = response.data;

if(html.includes("captcha") || html.includes("Robot Check")){
throw new Error("Amazon blocked request");
}

const $ = cheerio.load(html);

const products = [];

$("[data-component-type='s-search-result']")
.each((i,el)=>{

const title =
$(el).find("h2 span").text().trim();

if(!title) return;

/* price extraction */

let priceText =
$(el).find(".a-price-whole").first().text();

if(!priceText){
priceText =
$(el).find(".a-offscreen").first().text();
}

const price =
priceText
? priceText.replace(/[^\d]/g,"")
: null;

/* rating */

const ratingText =
$(el).find(".a-icon-alt").first().text();

const rating =
ratingText
? parseFloat(ratingText.split(" ")[0])
: null;

/* reviews */

const reviewsText =
$(el).find(".s-underline-text").first().text();

const reviews =
reviewsText
? parseInt(reviewsText.replace(/[^\d]/g,""))
: 0;

/* link */

const href =
$(el).find("h2 a").attr("href");

const link =
href
? "https://www.amazon.in"+href
: null;

/* image */

const image =
$(el).find("img.s-image").attr("src");

if(!price) return;

products.push({

source:"Amazon",
title,
price:parseInt(price),
rating,
reviews,
image,
link

});

});

return products.slice(0,20);

}

catch(err){

console.error(
"Amazon scrape failed:",
err.message
);

return [];

}

}

module.exports = scrapeAmazon;