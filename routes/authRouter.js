const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController.js");

router.get("/signup/email", authController.emailCheck);

module.exports = router;
