function fakeReviewScore(product){

const rating = product.rating || 0;
const reviews = product.reviews || 0;

let suspicion = 0;

/* suspicious rating patterns */

if(rating > 4.7 && reviews < 30)
suspicion += 40;

if(reviews < 10)
suspicion += 20;

if(rating === 5 && reviews < 50)
suspicion += 30;

/* trustworthy */

if(reviews > 500)
suspicion -= 20;

return Math.max(0,Math.min(100,suspicion));

}

module.exports = fakeReviewScore;