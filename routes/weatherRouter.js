const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherController');

router.post('/getWeather', getWeather);

module.exports = router;
