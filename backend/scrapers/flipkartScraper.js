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

"Accept":
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",

"Accept-Language":"en-IN,en;q=0.9",

"Referer":"https://www.flipkart.com/",

"Upgrade-Insecure-Requests":"1",

"Connection":"keep-alive"

},

timeout:15000

};

if(agent){
options.httpsAgent = agent;
}

const response =
await queue.add(()=>axios.get(url,options));

const html = response.data;

if(
html.includes("captcha") ||
html.includes("blocked")
){
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

if(!price) return;

const ratingText =
$(el).find("div._3LWZlK").first().text();

const rating =
ratingText
? parseFloat(ratingText)
: null;

let reviews = 0;

const reviewText =
$(el).find("span._2_R_DZ").text();

if(reviewText){

const match =
reviewText.match(/\d+/);

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
$(el).find("img").attr("data-src") ||
null;

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