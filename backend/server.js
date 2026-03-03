require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

/* ======================
INIT APP
====================== */

const app = express();

/* ======================
CORS (MUST BE FIRST)
====================== */

app.use(cors({
origin: [
"http://127.0.0.1:5500",
"http://localhost:5500"
],
methods:["GET","POST","PUT","DELETE"],
credentials:true
}));

/* ======================
GLOBAL MIDDLEWARE
====================== */

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

/* ======================
STATIC FRONTEND (optional)
====================== */

app.use(express.static("../frontend/public"));

/* ======================
LOAD GOOGLE AUTH
====================== */

require("./config/googleAuth");

/* ======================
ROUTES
====================== */

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
const imageRoutes = require("./routes/image.routes");

/* AFTER express.json() */
app.use("/api/products", imageRoutes);

/* ======================
DATABASE
====================== */

mongoose.connect(process.env.MONGO_URI,)
.then(()=>{
console.log(" MongoDB Connected");
})
.catch(err=>{
console.error("Mongo Error:",err);
});

/* ======================
HEALTH CHECK (DEBUG)
====================== */

app.get("/",(req,res)=>{
res.send("DealDot API Running");
});

/* ======================
SERVER START
====================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
console.log(`🚀 Server running on port ${PORT}`);
});