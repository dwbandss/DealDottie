const express = require("express");
const router = express.Router();
const multer = require("multer");
const imageController =
  require("../controllers/image.controller");

/* MEMORY STORAGE (IMPORTANT) */
const upload = multer({
  storage: multer.memoryStorage()
});

router.post(
  "/image-search",
  upload.single("image"),
  imageController.detectProduct
);

module.exports = router;