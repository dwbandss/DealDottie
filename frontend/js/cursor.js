const cursor = document.querySelector(".custom-cursor");
const halo = document.querySelector(".global-halo");

let mouseX = 0;
let mouseY = 0;

let cursorX = 0;
let cursorY = 0;


/* ===============================
 CURSOR TRACKING
================================ */

window.addEventListener("mousemove",(e)=>{
  mouseX = e.clientX;
  mouseY = e.clientY;
});


/* ===============================
 SMOOTH CURSOR LOOP
================================ */

function animate(){

cursorX += (mouseX - cursorX) * 0.22;
cursorY += (mouseY - cursorY) * 0.22;

cursor.style.transform =
`translate3d(${cursorX}px,${cursorY}px,0)`;

/* HALO FOLLOW */
if(halo){
halo.style.backgroundPosition =
`${mouseX}px ${mouseY}px`;
}

requestAnimationFrame(animate);
}

animate();


/* ===============================
 MAGNETIC HOVER
================================ */

document.querySelectorAll("button, .deal-card")
.forEach(el=>{

el.addEventListener("mousemove",(e)=>{

const rect = el.getBoundingClientRect();

const x =
e.clientX - rect.left - rect.width/2;

const y =
e.clientY - rect.top - rect.height/2;

el.style.setProperty("--mx",`${x*0.12}px`);
el.style.setProperty("--my",`${y*0.12}px`);

});

el.addEventListener("mouseleave",()=>{

el.style.setProperty("--mx","0px");
el.style.setProperty("--my","0px");

});

});
/* ===============================
  3D CARD DEPTH EFFECT
================================ */

/* ===============================
  3D CARD DEPTH EFFECT
================================ */

const dealCard = document.querySelector(".deal-card");

document.addEventListener("mousemove",(e)=>{

if(!dealCard) return;

const rect = dealCard.getBoundingClientRect();

const centerX = rect.left + rect.width/2;
const centerY = rect.top + rect.height/2;

const percentX =
(e.clientX - centerX) / rect.width;

const percentY =
(e.clientY - centerY) / rect.height;

/* rotation strength */
const rotateY = percentX * 12;
const rotateX = percentY * -12;

dealCard.style.setProperty(
"--rx",`${rotateX}deg`
);

dealCard.style.setProperty(
"--ry",`${rotateY}deg`
);

/* dynamic light */
dealCard.style.setProperty(
"--lightX",
`${(percentX+0.5)*100}%`
);

dealCard.style.setProperty(
"--lightY",
`${(percentY+0.5)*100}%`
);

});


/* RESET WHEN LEAVING HERO */

document.addEventListener("mouseleave",()=>{

dealCard.style.setProperty("--rx","0deg");
dealCard.style.setProperty("--ry","0deg");

});


