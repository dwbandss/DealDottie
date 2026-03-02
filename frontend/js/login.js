/* ===============================
 VALIDATION HELPERS
================================ */

function validateEmail(email){
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password){
return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}


/* ===============================
 LOAD LOGIN COMPONENT
================================ */

fetch("../components/loginModal.html")
.then(res => res.text())
.then(html => {

document.getElementById("loginContainer").innerHTML = html;

initAuth();

});


/* ===============================
 AUTH SYSTEM
================================ */

function initAuth(){

const modal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.getElementById("closeLogin");
const slider = document.getElementById("authSlider");

if(!modal || !slider) return;


/* ===============================
 MODAL CONTROL
================================ */

if(loginBtn){
loginBtn.onclick = ()=>{
modal.classList.add("active");
};
}

function closeModal(){

modal.classList.remove("active");

setTimeout(()=>{
slider.style.transform =
"translate3d(0,0,0)";
},300);

}

if(closeBtn) closeBtn.onclick = closeModal;

modal.addEventListener("click",(e)=>{
if(e.target === modal) closeModal();
});

document.addEventListener("keydown",(e)=>{
if(e.key === "Escape") closeModal();
});


/* ===============================
 SLIDER ENGINE
================================ */

function goStep(index){
slider.style.transform =
`translate3d(-${index * 100}%,0,0)`;
}


/* ===============================
 AUTH METHOD SELECT
================================ */

const emailStart =
document.getElementById("emailStart");

if(emailStart)
emailStart.onclick = ()=> goStep(1);


const startRegister =
document.getElementById("startRegister");

if(startRegister)
startRegister.onclick = ()=> goStep(3);


/* ===============================
 LOGIN FLOW
================================ */

const loginNext =
document.getElementById("loginNext");

if(loginNext)
loginNext.onclick = ()=>{

const email =
document.getElementById("loginEmail").value.trim();

if(!validateEmail(email)){
alert("Enter a valid email");
return;
}

goStep(2);
};


/* LOGIN SUBMIT */

const loginSubmit =
document.getElementById("loginSubmit");

if(loginSubmit)
loginSubmit.onclick = async ()=>{

const email =
document.getElementById("loginEmail").value;

const password =
document.getElementById("loginPassword").value;

if(!password){
alert("Enter password");
return;
}

try{

const res = await fetch(
"http://127.0.0.1:5000/auth/login",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
credentials:"include",
body:JSON.stringify({ email, password })
});

const data = await res.json();

if(res.ok){

window.location.href =
"/frontend/public/dashboard.html";

}else{
alert(data.message || "Login failed");
}

}catch(err){
console.error(err);
alert("Server error");
}

};


/* ===============================
 REGISTER FLOW
================================ */

const regNextName =
document.getElementById("regNextName");

if(regNextName)
regNextName.onclick = ()=>{

const name =
document.getElementById("regName").value.trim();

if(name.length < 3){
alert("Enter full name");
return;
}

goStep(4);
};


/* EMAIL STEP */

const regNextEmail =
document.getElementById("regNextEmail");

if(regNextEmail)
regNextEmail.onclick = ()=>{

const email =
document.getElementById("regEmail").value.trim();

if(!validateEmail(email)){
alert("Invalid email");
return;
}

goStep(5);
};


/* REGISTER SUBMIT */

const registerSubmit =
document.getElementById("registerSubmit");

if(registerSubmit)
registerSubmit.onclick = async ()=>{

const name =
document.getElementById("regName").value;

const email =
document.getElementById("regEmail").value;

const password =
document.getElementById("regPassword").value;

if(!validatePassword(password)){
alert(
`Password must contain:
• 8 characters
• One capital letter
• One number
• One special symbol`
);
return;
}

try{

const res = await fetch(
"http://127.0.0.1:5000/auth/register",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
credentials:"include",
body:JSON.stringify({
name,
email,
password
})
});

const data = await res.json();

if(res.ok){

window.location.href =
"/frontend/public/dashboard.html";

}else{
alert(data.message || "Registration failed");
}

}catch(err){
console.error(err);
alert("Server error");
}

};


/* ===============================
 GOOGLE LOGIN
================================ */

const googleBtn =
document.getElementById("googleLogin");

if(googleBtn){
googleBtn.onclick = ()=>{
window.location.href =
"http://127.0.0.1:5000/auth/google";
};
}

}