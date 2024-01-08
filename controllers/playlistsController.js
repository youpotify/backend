const playlistsService = require('../services/playlistsService');
const UserPlaylist = require('../database/models/playlist'); // UserPlaylist 모델 임포트

exports.createPlaylist = async (req, res) => {
    try {
        console.log("Text fields:", req.body); // 텍스트 필드 로그 출력
        console.log("Uploaded file:", req.file); // 파일 데이터 로그 출력

        // 파일이 존재할 경우, 그 경로를 가져옵니다
        const imagePath = req.file ? req.file.path : null;

        // req.body에 파일 경로 정보를 추가합니다
        const playlistData = {
            ...req.body,
            image: imagePath
        };

        const newPlaylist = await playlistsService.createPlaylist(playlistData);
        res.status(201).json(newPlaylist);
    } catch (error) {
        console.error("Error in createPlaylist:", error);  // 에러 로깅
        res.status(400).json({ message: error.message });
    }
};




exports.getAllPlaylists = async (req, res) => {
    try {
        let playlists = await UserPlaylist.find({});
        // 이미지 URL을 전체 경로로 변환
        playlists = playlists.map(playlist => {
            if (playlist.image) {
                playlist.image = `${req.protocol}://${req.get('host')}/${playlist.image}`;
            }
            return playlist;
        });
        res.status(200).json(playlists);
    } catch (error) {
        console.error("Error in getAllPlaylists:", error);
        res.status(500).json({ message: error.message });
    }
};
