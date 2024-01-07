const axios = require('axios');
const spotifyService = require('../services/spotifyService');
const { getPlaylistFromAlbum } = require('../services/youtubeService');

exports.postAlbum = async (req, res) => {
    console.log('앨범라우터로 요청옴');
    //const albumId = req.query.id;
    const {albumData, youtubeId} = req.body;
    console.log(albumData.name, youtubeId);
    if(!albumData || !youtubeId ){
        return res.status(400).send('Album Data or YoutubeId is required');
    }

    try {
        const spotifyToken = await spotifyService.fetchSpotifyToken();
        if (!spotifyToken) {
            return res.status(500).send('Unable to fetch Spotify token');
        }

        const response = await axios.get(`https://api.spotify.com/v1/albums/${albumData.id}`, {
            headers: {
                'Authorization': `Bearer ${spotifyToken}`
            },
        });

        youtubeResponse = await getPlaylistFromAlbum(youtubeId, albumData.name);
        console.log(`유투브 res : ${youtubeResponse}`);

        const result = response.data;
        // console.log(result);
        res.json(result);

    } catch (error) {
        console.error('Error in fetching artist data', error);
        res.status(500).send('Error in fetching artist data');
    }
};


