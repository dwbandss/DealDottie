function fakeReviewRisk(product){

let risk = 0;

if(product.rating > 4.8 && product.reviews < 50)
risk += 30;

if(!product.reviews || product.reviews === 0)
risk += 20;

return risk;
}

function rankDeals(products){

if(!products || products.length === 0)
return [];

const avgPrice =
products.reduce((a,p)=>a+p.price,0)
/ products.length;

return products
.map(p=>{

let score = 50;

score += ((avgPrice - p.price)/avgPrice)*40;
score += (p.rating || 4)*5;
score -= fakeReviewRisk(p);

return{
...p,
dealScore:Math.round(score),
verdict:
score>75
? "🔥 Best Value"
: score>55
? "✅ Good Deal"
: "⚠ Risky Listing"
};

})
.sort((a,b)=>b.dealScore-a.dealScore);
}

module.exports = rankDeals;