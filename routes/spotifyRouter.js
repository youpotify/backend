const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');

router.get('/token', spotifyController.getToken);
router.get('/recommendations', spotifyController.getRecommendations);

module.exports = router;
