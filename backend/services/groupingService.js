const {
isSameProduct
} = require("./productMatcher");

/* =========================
VARIANT DETECTION
========================= */

function extractVariant(title){

const ram =
title.match(/(\d+)\s?gb\s?ram/i);

const storage =
title.match(/(\d+)\s?(gb|tb)(?!\s?ram)/i);

if(ram && storage)
return `${ram[1]}GB/${storage[1]}${storage[2].toUpperCase()}`;

if(storage)
return storage[1]+storage[2].toUpperCase();

return "Standard";

}

/* =========================
GROUP PRODUCTS BY SIMILARITY
========================= */

function groupProducts(products){

const groups = [];

products.forEach(product => {

let placed = false;

for(const group of groups){

const baseProduct = group.products[0];

if(
isSameProduct(
baseProduct.title,
product.title
)
){

group.products.push(product);
placed = true;
break;

}

}

if(!placed){

groups.push({

base: product.title,
variant: extractVariant(product.title),
products:[product]

});

}

});

return groups;

}

module.exports = groupProducts;