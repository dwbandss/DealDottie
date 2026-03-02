/* =====================================================
APP START
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

startBootSafe();
setupNavigation();

const btn=document.getElementById("searchBtn");
if(btn){
btn.addEventListener("click",startAISearch);
}

});
/* =====================================================
BOOT SYSTEM
===================================================== */

const bootMessages = [
"Connecting AI agents...",
"Loading marketplaces...",
"Preparing intelligence...",
"System Ready"
];

async function startBootSafe(){

const container = document.getElementById("bootSteps");
if(!container) return;

for(const msg of bootMessages){

const el=document.createElement("div");
el.className="boot-step";
el.innerText=msg;

container.appendChild(el);

await delay(600);
el.classList.add("active");
}

setTimeout(()=>{
const boot=document.getElementById("aiBoot");

if(boot){
boot.style.opacity="0";
setTimeout(()=>boot.remove(),500);
}
},1200);
}


/* =====================================================
NAVIGATION
===================================================== */

function setupNavigation(){

const pages=document.querySelectorAll(".page");

document.querySelectorAll("nav a")
.forEach(link=>{

link.addEventListener("click",()=>{

pages.forEach(p=>p.classList.remove("active"));

const target =
document.getElementById(link.dataset.page+"Page");

if(target) target.classList.add("active");

});

});
}


/* =====================================================
AI THINKING ENGINE
===================================================== */

async function startAISearch(){

const query =
document.getElementById("productInput").value.trim();

if(!query) return;

try{

clearDeals();
clearThinking();
clearVariantBox();

/* AI thinking */

await addThought("Understanding product intent...");
await addThought("Scanning real marketplaces...");
await addThought("Detecting fake reviews...");
await addThought("Ranking smartest deals...");

/* API CALL */

const response = await fetch(
`http://127.0.0.1:5000/api/products/search?query=${encodeURIComponent(query)}`
);

const data = await response.json();

/* =========================
VARIANT MODE
========================= */

if(data.askVariant === true){

await addThought("Multiple variants detected.");

showVariantSelector(query,data.variants);

/* IMPORTANT HARD STOP */
return;
}

/* =========================
PRODUCT RESULTS
========================= */

const products = data.products || data;

if(!products || products.length === 0){
await addThought("⚠ No accurate deals found.");
return;
}

showRealDeals(products);

await addThought("Best deals discovered ✓");

}
catch(err){

console.error(err);

/* ONLY show error if REAL failure */
await addThought("⚠ Marketplace temporarily unavailable.");
}
}


/* =====================================================
THINKING STREAM
===================================================== */

async function addThought(text){

const stream=document.getElementById("thinkingStream");
if(!stream) return;

const el=document.createElement("div");
el.className="thought";
el.innerText=text;

stream.appendChild(el);

await delay(650);
el.classList.add("show");
}

function clearThinking(){
const stream=document.getElementById("thinkingStream");
if(stream) stream.innerHTML="";
}


/* =====================================================
REAL DEAL DISPLAY
===================================================== */

function showRealDeals(products){

const results=document.getElementById("dealResults");
if(!results) return;

products.forEach(p=>{

const card=document.createElement("div");
card.className="deal-card";

/* backend uses verdict not label */
const label = p.verdict || "Good Deal";

card.innerHTML=`
<img src="${p.image}" class="deal-img"/>

<h4>${p.title}</h4>

<p>⭐ ${p.rating || 4}</p>

<p class="price">₹ ${p.price}</p>

<div class="deal-score">
AI Score: ${p.dealScore || 70}
</div>

<div class="deal-label">
${label}
</div>
`;

results.appendChild(card);

});
}

function clearDeals(){
const results=document.getElementById("dealResults");
if(results) results.innerHTML="";
}

/* =====================================================
VARIANT SYSTEM
===================================================== */

function clearVariantBox(){
const box=document.getElementById("variantSelector");
if(box) box.innerHTML="";
}

function showVariantSelector(query,variants){

const box=document.getElementById("variantSelector");
if(!box) return;

box.innerHTML="";

const title=document.createElement("div");
title.className="variant-title";
title.innerText="Select a variant";

box.appendChild(title);

variants.forEach(v=>{

const btn=document.createElement("button");
btn.className="variant-option";
btn.innerText=v;

btn.onclick=()=>{
startAISearchWithVariant(query,v);
};

box.appendChild(btn);

});
}
async function startAISearchWithVariant(baseQuery,variant){

clearVariantBox();

await addThought(`Searching ${variant} deals...`);

const response = await fetch(
`http://127.0.0.1:5000/api/products/search?query=${encodeURIComponent(baseQuery+" "+variant)}`
);

const data = await response.json();

const products = data.products || data;

showRealDeals(products);

await addThought("Best variant deals discovered ✓");
}

/* =====================================================
UTILITY
===================================================== */

function delay(ms){
return new Promise(resolve=>setTimeout(resolve,ms));
}
