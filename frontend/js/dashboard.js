/* =====================================================
APP START
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

startBootSafe();
setupNavigation();

/* Search button */
document
.getElementById("searchBtn")
.addEventListener("click", startAISearch);

/* Enter key */
document
.getElementById("productInput")
.addEventListener("keydown", (e)=>{
if(e.key === "Enter"){
startAISearch();
}
});

/* Upload button */
document
.getElementById("uploadBtn")
.addEventListener("click", ()=>{
document.getElementById("imageInput").click();
});

/* Image selection */
document
.getElementById("imageInput")
.addEventListener("change", handleImageSearch);

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
VARIANT SYSTEM (FIXED)
===================================================== */

function clearVariantBox(){
  const box = document.getElementById("variantSelector");
  if(box) box.innerHTML = "";
}

function showVariantSelector(query, variants){

  const box = document.getElementById("variantSelector");
  if(!box) return;

  box.innerHTML = "";

  const title = document.createElement("div");
  title.className = "variant-title";
  title.innerText = "Select a variant";
  box.appendChild(title);

  variants.forEach(v => {

    const btn = document.createElement("button");
    btn.className = "variant-option";
    btn.innerText = v;

    btn.onclick = () => {
      startAISearchWithVariant(query, v);
    };

    box.appendChild(btn);
  });
}


async function startAISearchWithVariant(baseQuery, variant){

  try{

    clearVariantBox();
    clearDeals();
    clearThinking();

    await addThought(`Searching ${variant} deals...`);

    const response = await fetch(
      `http://127.0.0.1:5000/api/products/search?query=${encodeURIComponent(baseQuery)}&variant=${encodeURIComponent(variant)}`
    );

    const data = await response.json();

    const products = data.products || data;

    if(!products || products.length === 0){
      await addThought("⚠ No deals found for this variant.");
      return;
    }

    showRealDeals(products);

    await addThought("Best variant deals discovered ✓");

  } catch(err){

    console.error(err);
    await addThought("⚠ Variant search failed.");
  }
}

/* =====================================================
THINKING STREAM
===================================================== */

// async function addThought(text){

// const stream=document.getElementById("thinkingStream");
// if(!stream) return;

// const el=document.createElement("div");
// el.className="thought";
// el.innerText=text;

// stream.appendChild(el);

// await delay(650);
// el.classList.add("show");
// }

// function clearThinking(){
// const stream=document.getElementById("thinkingStream");
// if(stream) stream.innerHTML="";
// }


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
THINKING STREAM
===================================================== */

async function addThought(text){

  const stream=document.getElementById("thinkingStream");
  if(!stream) return;

  const el=document.createElement("div");
  el.className="thought";
  el.innerText=text;

  stream.appendChild(el);

  await delay(600);

  el.classList.add("show");
}

function clearThinking(){
  const stream=document.getElementById("thinkingStream");
  if(stream) stream.innerHTML="";
}
/* =====================================================
IMAGE SEARCH
===================================================== */

async function handleImageSearch(e){

  const file = e.target.files[0];
  if(!file) return;

  clearDeals();
  clearThinking();
  clearVariantBox();

  await addThought("Analyzing uploaded image...");
  await addThought("Detecting product...");

  const formData = new FormData();
  formData.append("image", file);

  try{

    const response = await fetch(
      "http://127.0.0.1:5000/api/products/image-search",
      {
        method:"POST",
        body:formData
      }
    );

    const data = await response.json();

    if(!data.query){
      await addThought("⚠ Could not detect product");
      return;
    }

    document.getElementById("productInput").value = data.query;

    await addThought(`Detected: ${data.query}`);
    await addThought("Searching deals...");

    startAISearch();

  } catch(err){

    console.error(err);
    await addThought("⚠ Image search failed");
  }
}
/* =====================================================
UTILITY
===================================================== */

function delay(ms){
return new Promise(resolve=>setTimeout(resolve,ms));
}
