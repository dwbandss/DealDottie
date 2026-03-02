function extractModel(query){

query = query.toLowerCase();

/* detect iphone number */
const iphoneMatch = query.match(/iphone\s*(\d+)/);

if(iphoneMatch){
return {
brand:"iphone",
model:iphoneMatch[1]
};
}

return null;
}

/* ----------------------------- */
/* FILTER PRODUCTS SMARTLY */
/* ----------------------------- */

function filterAccurateProducts(products, query){

const intent = extractModel(query);

if(!intent) return products;

/* strict filtering */

return products.filter(p=>{

const title = p.title.toLowerCase();

/* must contain brand */
if(!title.includes(intent.brand))
return false;

/* must contain model number */
if(!title.includes(intent.model))
return false;

/* remove accessories */
if(
title.includes("case") ||
title.includes("cover") ||
title.includes("charger") ||
title.includes("cable")
){
return false;
}

return true;

});
}

module.exports = filterAccurateProducts;