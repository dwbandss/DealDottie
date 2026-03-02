const router=require("express").Router();
const controller=require("../controllers/product.controller");

router.get("/search",controller.searchProducts);

module.exports=router;