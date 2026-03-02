/* ===============================
   SMARTDEAL SCROLL ENGINE
================================ */

const steps = [
{
title:"Value beyond lowest price.",
sub:"Specifications, ratings and reliability decide the best deal.",
card:"Deal Intelligence Engine",
desc:"Aggregates prices across Amazon, Flipkart and more.",
img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
},
{
title:"Reviews you can trust.",
sub:"AI removes fake and paid reviews instantly.",
card:"Review Authenticity AI",
desc:"Detects manipulation patterns.",
img:"https://images.unsplash.com/photo-1556745757-8d76bdb6984b"
},
{
title:"Compare smarter.",
sub:"Specifications normalized automatically.",
card:"Specification Analyzer",
desc:"True comparison across stores.",
img:"https://images.unsplash.com/photo-1607083206968-13611e3d76db"
},
{
title:"Best deal. Zero bias.",
sub:"Ranking based purely on value score.",
card:"AI Deal Ranker",
desc:"No sponsored placement ever.",
img:"https://images.unsplash.com/photo-1563013544-824ae1b704d3"
}
];


/* ===============================
   ELEMENTS
================================ */

const hero = document.querySelector(".hero");

const title = document.getElementById("hero-title");
const sub = document.getElementById("hero-sub");
const cardTitle = document.getElementById("card-title");
const cardDesc = document.getElementById("card-desc");
const img = document.querySelector(".product-visual img");
const stepUI = document.getElementById("step");

const card = document.querySelector(".deal-card");
const orb1 = document.querySelector(".orb1");
const orb2 = document.querySelector(".orb2");

let currentStep = -1;


/* ===============================
   SCROLL ENGINE
================================ */

function updateScrollEffects(){

const heroTop = hero.offsetTop;
const heroHeight = hero.offsetHeight;
const spacer = document.querySelector(".scroll-spacer");

const start = spacer.offsetTop;
const height = spacer.offsetHeight;

const wrapper =
document.querySelector(".hero-wrapper");

const rect = wrapper.getBoundingClientRect();


const totalScroll =
document.querySelector(".scroll-spacer").offsetHeight
- window.innerHeight;

const progress = scrollY / totalScroll;

/* divide scroll equally */
const step = Math.min(
steps.length - 1,
Math.floor(progress * steps.length)
);

/* LOCK HERO UNTIL LAST STEP */

const heroWrapper =
document.querySelector(".hero-wrapper");

if(progress < 0.98){
heroWrapper.style.marginBottom = "0px";
}else{
heroWrapper.style.marginBottom = "0px";
}
/* STEP CHANGE */

if(step !== currentStep){

currentStep = step;

title.style.opacity = 0;
img.style.opacity = 0;

setTimeout(()=>{

title.textContent = steps[step].title;
sub.textContent = steps[step].sub;
cardTitle.textContent = steps[step].card;
cardDesc.textContent = steps[step].desc;

img.src = steps[step].img;

stepUI.textContent =
`${step+1} / ${steps.length}`;

title.style.opacity = 1;
img.style.opacity = 1;

},200);
}


/* CARD DEPTH */

const depth = scrollY * 0.04;

card.style.setProperty(
"--scrollY",
`${depth*-0.2}px`
);

/* HALO PARALLAX */

orb1.style.transform =
`translateY(${scrollY*0.2}px)`;

orb2.style.transform =
`translateY(${scrollY*-0.15}px)`;


/* TEXT MOTION */

const localProgress =
(progress * steps.length) % 1;

title.style.transform =
`translateY(${localProgress*40}px)`;

title.style.opacity =
1 - localProgress*0.35;

}

window.addEventListener("scroll", updateScrollEffects);


/* ===============================
   LENIS SMOOTH SCROLL
================================ */

const lenis = new Lenis({
duration:1.8,
smooth:true,
wheelMultiplier:0.8
});

function raf(time){
lenis.raf(time);
requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
