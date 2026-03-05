const axios = require("../utils/httpClient");
const cheerio = require("cheerio");

const queue = require("../utils/requestQueue");
const getRandomProxy = require("../utils/proxyPool");
const getRandomUserAgent = require("../utils/userAgents");

async function scrapeFlipkart(query){

try{

const url =
`https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;

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

if(html.includes("captcha") || html.includes("blocked")){
throw new Error("Flipkart blocked request");
}

const $ = cheerio.load(html);

const products = [];

$("div[data-id]").each((i,el)=>{

const title =
$(el).find("div._4rR01T").text().trim() ||
$(el).find("a.s1Q9rs").text().trim();

if(!title) return;

const priceText =
$(el).find("div._30jeq3").first().text();

const price =
priceText
? priceText.replace(/[^\d]/g,"")
: null;

const ratingText =
$(el).find("div._3LWZlK").first().text();

const rating =
ratingText
? parseFloat(ratingText)
: null;

const reviewsText =
$(el).find("span._2_R_DZ").text();

let reviews = 0;

if(reviewsText){

const match =
reviewsText.match(/\d+/g);

if(match)
reviews = parseInt(match[0]);

}

const href =
$(el).find("a").attr("href");

const link =
href
? "https://www.flipkart.com"+href
: null;

const image =
$(el).find("img").attr("src") ||
$(el).find("img").attr("data-src");

if(!price) return;

products.push({

source:"Flipkart",
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
"Flipkart scrape failed:",
err.message
);

return [];

}

}

module.exports = scrapeFlipkart;