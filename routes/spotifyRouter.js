const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');

router.get('/token', spotifyController.getToken);
router.get('/recommendations', spotifyController.getRecommendations);
router.get('/topChart', spotifyController.getTopChart);

module.exports = router;
