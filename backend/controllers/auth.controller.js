const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


/* ================================
 JWT CREATION
================================ */

const createToken = (user)=>{
return jwt.sign(
{
 id:user._id,
 email:user.email
},
process.env.JWT_SECRET,
{ expiresIn:"7d" }
);
};



/* ================================
 REGISTER USER
================================ */

exports.register = async (req,res)=>{

try{

const { name, email, password } = req.body;

if(!email || !password){
return res.status(400).json({
 message:"Missing fields"
});
}

/* CHECK EXISTING USER */

const existingUser =
await User.findOne({ email });

if(existingUser){
return res.status(409).json({
 message:"Account already exists",
 action:"login"
});
}


/* HASH PASSWORD */

const hash =
await bcrypt.hash(password,10);


/* CREATE USER */

const user = await User.create({
 name,
 email,
 password:hash,
 isNewUser:true
});


/* CREATE TOKEN */

const token = createToken(user);


/* STORE COOKIE */

res.cookie("token",token,{
 httpOnly:true,
 sameSite:"lax",
 secure:false
});


return res.status(201).json({
 success:true,
 user:{
 id:user._id,
 email:user.email,
 name:user.name
 }
});

}catch(err){
console.error(err);
res.status(500).json({
 message:"Server error"
});
}

};



/* ================================
 LOGIN USER
================================ */

exports.login = async (req,res)=>{

try{

const { email, password } = req.body;

const user =
await User.findOne({ email });

if(!user){
return res.status(404).json({
 message:"Account not found",
 action:"register"
});
}


/* PASSWORD CHECK */

const valid =
await bcrypt.compare(password,user.password);

if(!valid){
return res.status(401).json({
 message:"Incorrect password"
});
}


/* CREATE TOKEN */

const token = createToken(user);


/* COOKIE */

res.cookie("token",token,{
 httpOnly:true,
 sameSite:"lax",
 secure:false
});


return res.json({
 success:true,
 user:{
 id:user._id,
 email:user.email,
 name:user.name
 }
});

}catch(err){
console.error(err);
res.status(500).json({
 message:"Login failed"
});
}

};



/* ================================
 CURRENT USER
================================ */

exports.me = async(req,res)=>{

try{

const user =
await User.findById(req.user.id)
.select("-password");

res.json(user);

}catch{
res.status(401).json({
 message:"Unauthorized"
});
}

};



/* ================================
 LOGOUT
================================ */

exports.logout = (req,res)=>{

res.clearCookie("token");

res.json({
 success:true
});

};