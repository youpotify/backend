const express = require('express');
const playlistController = require('../controllers/playlistsController');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// multer 디스크 스토리지 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 파일이 저장될 경로
    },
    filename: function (req, file, cb) {
        // 파일명 설정 (예: image-1612291923123.jpg)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/playlists', upload.single('image'), playlistController.createPlaylist);
router.get('/playlists', playlistController.getAllPlaylists);


module.exports = router;
