function random(min,max){
return Math.floor(Math.random()*(max-min)+min);
}

function buildProduct(query){

const basePrice = random(300,50000);

return {
source:"Flipkart",
title:`${query} - Flipkart Edition`,
price:basePrice,
rating:(Math.random()*1.2+3.5).toFixed(1),
reviews:random(10,500),
image:"https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/x/x/x/smartphone-original.jpg",
link:"https://www.flipkart.com"
};

}

async function scrapeFlipkart(query){

const results=[];

for(let i=0;i<5;i++){
results.push(buildProduct(query));
}

return results;

}

module.exports = scrapeFlipkart;