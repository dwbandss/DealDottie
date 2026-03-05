/* =========================
TITLE CLEAN
========================= */

function cleanTitle(title){

return title
.toLowerCase()
.replace(/[()|,-]/g," ")
.replace(/\s+/g," ")
.trim();

}

/* =========================
TOKENIZE
========================= */

function tokenize(title){

return cleanTitle(title)
.split(" ")
.filter(w => w.length > 1);

}

/* =========================
BRAND DETECTION
========================= */

function detectBrand(title){

const brands = [
"samsung",
"apple",
"iphone",
"xiaomi",
"redmi",
"oneplus",
"realme",
"oppo",
"vivo",
"motorola",
"google",
"pixel",
"nothing"
];

const t = cleanTitle(title);

for(const b of brands){

if(t.includes(b))
return b;

}

return null;

}

/* =========================
MODEL DETECTION
========================= */

function detectModel(title){

const t = cleanTitle(title);

/* Galaxy S series */
let match = t.match(/s\d{1,2}/);
if(match) return match[0];

/* iPhone */
match = t.match(/iphone\s?\d+/);
if(match) return match[0];

/* Pixel */
match = t.match(/pixel\s?\d+/);
if(match) return match[0];

/* OnePlus */
match = t.match(/oneplus\s?\d+/);
if(match) return match[0];

return null;

}

/* =========================
VARIANT DETECTION
========================= */

function detectVariant(title){

const variants = [
"ultra",
"pro",
"plus",
"lite",
"fe",
"mini",
"max"
];

const t = cleanTitle(title);

for(const v of variants){

if(t.includes(v))
return v;

}

return "standard";

}

/* =========================
TOKEN SIMILARITY
========================= */

function similarityScore(a,b){

const tokensA = tokenize(a);
const tokensB = tokenize(b);

let matches = 0;

tokensA.forEach(word=>{
if(tokensB.includes(word))
matches++;
});

return matches / tokensA.length;

}

/* =========================
MAIN PRODUCT MATCH ENGINE
========================= */

function isSameProduct(query,title){

const qBrand = detectBrand(query);
const tBrand = detectBrand(title);

if(qBrand && tBrand && qBrand !== tBrand)
return false;

const qModel = detectModel(query);
const tModel = detectModel(title);

if(qModel && tModel && qModel !== tModel)
return false;

/* fallback similarity */

const sim = similarityScore(query,title);

return sim >= 0.45;

}

module.exports = {

cleanTitle,
tokenize,
similarityScore,
detectBrand,
detectModel,
detectVariant,
isSameProduct

};