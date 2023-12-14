const { Router } = require("express");
const router = Router();
const oauthController = require("../controllers/oauthController.js");

router.get("/spotify/pkce", oauthController.generatePKCE);
router.get("/spotify/tokens", oauthController.getTokens);

module.exports = router;
