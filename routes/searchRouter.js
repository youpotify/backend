const { Router } = require("express");
const router = Router();
const searchController = require("../controllers/searchController.js");

router.get("/", searchController.getSearchResult);

module.exports = router;
