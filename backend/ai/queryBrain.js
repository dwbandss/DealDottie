function extractSpecs(title){

title = title.toLowerCase();

const ramMatch =
title.match(/(\d+)\s?gb\s?ram/i);

const storageMatch =
title.match(/(\d+)\s?gb(?!\s?ram)/i);

let ram = ramMatch ? ramMatch[1]+"GB" : null;
let storage = storageMatch ? storageMatch[1]+"GB" : null;

let brand = null;
let model = null;

if(title.includes("samsung")){
brand="Samsung";
}

if(title.includes("iphone")){
brand="Apple";
}

if(title.includes("nothing")){
brand="Nothing";
}

const modelMatch =
title.match(/(s\d{2}|iphone\s?\d+|phone\s?\d[a-z]?)/i);

model = modelMatch ? modelMatch[0] : null;

return {
brand,
model,
ram,
storage
};

}

function isSameProduct(a,b){

const A = extractSpecs(a.title);
const B = extractSpecs(b.title);

return (
A.brand === B.brand &&
A.model === B.model &&
A.ram === B.ram &&
A.storage === B.storage
);

}

module.exports = {
extractSpecs,
isSameProduct
};