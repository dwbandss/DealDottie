/* ===============================
 LOAD LOGIN COMPONENT
================================ */

fetch("../components/loginModal.html")
.then(response => response.text())
.then(data => {

    document.getElementById("loginContainer").innerHTML = data;

    setupLoginModal();
});


/* ===============================
 MODAL LOGIC
================================ */

function setupLoginModal(){

const loginBtn = document.getElementById("loginBtn");
const modal = document.getElementById("loginModal");
const closeBtn = document.getElementById("closeLogin");

/* OPEN */
loginBtn.addEventListener("click", () => {
    modal.classList.add("active");
});

/* CLOSE BUTTON */
closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
});

/* CLICK OUTSIDE */
modal.addEventListener("click",(e)=>{
    if(e.target === modal){
        modal.classList.remove("active");
    }
});

/* ESC KEY */
document.addEventListener("keydown",(e)=>{
    if(e.key === "Escape"){
        modal.classList.remove("active");
    }
});

}