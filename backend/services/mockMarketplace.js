function random(min,max){
return Math.floor(Math.random()*(max-min)+min);
}

const marketplaces = [
"Flipkart",
"Croma",
"Reliance Digital",
"Vijay Sales",
"Tata Cliq"
];

module.exports = function generateMarketplaceDeals(product){

const deals = [];

marketplaces.forEach(site=>{

const variation =
random(-2000,2000);

const price =
Math.max(1000,product.price + variation);

const rating =
(3.8 + Math.random()*1.2).toFixed(1);

const reviews =
random(20,500);

deals.push({

title:product.title,
price,
rating:Number(rating),
reviews,
seller:site,
image:product.image,
link:null

});

});

return deals;

};