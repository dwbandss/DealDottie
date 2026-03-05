function pricePrediction(product,avgPrice){

const price = product.price;

if(price < avgPrice*0.8)
return "🔥 Historic Low";

if(price < avgPrice*0.95)
return "💰 Good Deal";

if(price > avgPrice*1.1)
return "⚠ Overpriced";

return "Fair Price";

}

module.exports = pricePrediction;