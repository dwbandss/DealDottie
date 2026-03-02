/* =====================================
 WAIT UNTIL PAGE READY
===================================== */

window.addEventListener("load", () => {

initTyping();
initCardReveal();

});


/* =====================================
 TYPEWRITER TITLE
===================================== */

function initTyping(){

const title = document.getElementById("howTitle");
if(!title) return;

const text = title.dataset.text;

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

startTyping(title,text);

}else{

resetTyping(title);

}

});

},{ threshold:0.4 });

observer.observe(title);
}


function startTyping(title,text){

if(title.dataset.running === "true") return;

title.dataset.running="true";
title.textContent="";
title.classList.add("typing");

let i=0;

function type(){
if(i < text.length){
title.textContent += text.charAt(i);
i++;
setTimeout(type,40);
}else{
title.classList.remove("typing");
}
}

type();
}


function resetTyping(title){
title.dataset.running="false";
title.textContent="";
}


/* =====================================
 CARD RISE ANIMATION
===================================== */

function initCardReveal(){

const cards = document.querySelectorAll(".how-card");
const grid = document.querySelector(".how-grid");

const observer = new IntersectionObserver(entries => {

entries.forEach(entry=>{

if(entry.isIntersecting){

cards.forEach((card,index)=>{
setTimeout(()=>{
card.classList.add("show");
}, index * 200);
});

}else{

cards.forEach(card=>{
card.classList.remove("show");
});

}

});

},{ threshold:0.25 });

observer.observe(grid);
}