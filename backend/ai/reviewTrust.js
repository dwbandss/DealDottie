function reviewTrust(product){

let trust = 70;

if(product.reviews < 5)
trust -= 30;

if(product.rating > 4.8)
trust -= 10;

if(product.reviews > 200)
trust += 10;

if(product.rating < 3.5)
trust -= 10;

return Math.max(
0,
Math.min(trust,100)
);

}

module.exports = reviewTrust;