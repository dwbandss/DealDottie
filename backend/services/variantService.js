function extractVariantInfo(title){

if(!title) return null;

const ramMatch =
title.match(/(\d+)\s?GB\s?RAM/i);

const storageMatch =
title.match(/(\d+)\s?GB(?!\s?RAM)/i);

let ram =
ramMatch ? ramMatch[1]+"GB" : null;

let storage =
storageMatch ? storageMatch[1]+"GB" : null;

if(ram && storage){
return `${ram}/${storage}`;
}

if(storage){
return storage;
}

return null;

}

function detectVariants(products){

const variants = new Set();

products.forEach(p=>{

const variant =
extractVariantInfo(p.title);

if(variant){
variants.add(variant);
}

});

return [...variants];

}

module.exports = {
detectVariants,
extractVariantInfo
};