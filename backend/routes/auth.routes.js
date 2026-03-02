const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const controller =
require("../controllers/auth.controller");

/* =====================
 NORMAL AUTH
===================== */

router.post("/register", controller.register);
router.post("/login", controller.login);


/* =====================
 GOOGLE LOGIN START
===================== */

router.get(
"/google",
passport.authenticate("google",{
scope:["profile","email"]
})
);


/* =====================
 GOOGLE CALLBACK
===================== */

router.get(
"/google/callback",
passport.authenticate("google",
{ session:false }),
(req,res)=>{

const token = jwt.sign(
{
id:req.user._id
},
process.env.JWT_SECRET,
{ expiresIn:"7d" }
);

res.cookie("token",token,{
httpOnly:true,
sameSite:"lax",
secure:false
});

res.redirect(
"http://127.0.0.1:5500/public/dashboard.html"
);

});

module.exports = router;