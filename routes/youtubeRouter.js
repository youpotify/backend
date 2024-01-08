const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');
const youtubeService = require('../services/youtubeService');

router.get('/search', youtubeController.search);
router.get('/testPlaylist',youtubeService.getPlaylistFromAlbum);

module.exports = router;
