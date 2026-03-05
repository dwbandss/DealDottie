function dealHeat(product){

const rating =
product.rating || 4;

const reviews =
product.reviews || 1;

const price =
product.price || 1;

const popularity =
Math.log10(reviews+1)*20;

const ratingScore =
(rating/5)*40;

const priceScore =
100000/price;

return Math.round(
ratingScore +
popularity +
priceScore
);

}

module.exports = dealHeat;