const express = require('express');
const albumController = require('../controllers/albumController');
const artistController = require('../controllers/artistController');
const router = express.Router();

router.get('/search', artistController.searchArtist);
router.post('/album', albumController.postAlbum);

module.exports = router;