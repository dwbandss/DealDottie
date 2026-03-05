const fakeReviewScore =
require("./fakeReviewDetector");

function reviewTrust(product){

const fake =
fakeReviewScore(product);

const reviews =
product.reviews || 1;

const trust =
100 - fake + Math.log10(reviews+1)*10;

return Math.min(100,Math.round(trust));

}

module.exports = reviewTrust;