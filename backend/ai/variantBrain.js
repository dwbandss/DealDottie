function detectVariants(products){

const variants = new Set();

products.forEach(p=>{

const title = p.title.toLowerCase();

if(title.includes("pro max"))
variants.add("Pro Max");

else if(title.includes("pro"))
variants.add("Pro");

else if(title.includes("plus"))
variants.add("Plus");

else if(title.includes("iphone 15"))
variants.add("Standard");

});

return Array.from(variants);
}

module.exports = detectVariants;