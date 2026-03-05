function tokenize(title){

return title
.toLowerCase()
.replace(/[^\w\s]/g,"")
.split(/\s+/)
.filter(Boolean);

}

function similarityScore(a,b){

const A = tokenize(a);
const B = tokenize(b);

const setA = new Set(A);
const setB = new Set(B);

let intersection = 0;

for(const word of setA){

if(setB.has(word)){
intersection++;
}

}

const union =
new Set([...A,...B]).size;

return intersection / union;

}

module.exports = similarityScore;