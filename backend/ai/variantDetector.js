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

else
variants.add("Standard");

});

return [...variants];
}

module.exports = detectVariants;