const axios = require('axios');
const spotifyService = require('../services/spotifyService');
const { getPlaylistFromAlbum } = require('../services/youtubeService');

exports.postAlbum = async (req, res) => {
    //const albumId = req.query.id;
    const {albumData, youtubeId} = req.body;
    // console.log(albumData);
    if(!albumData || !youtubeId ){
        return res.status(400).send('Album Data or YoutubeId is required');
    }

    const token = await spotifyService.fetchSpotifyToken();
    if (!token) {
        return res.status(500).send('Unable to fetch Spotify token');
    }

    try {
        const response = await axios.get(`https://api.spotify.com/v1/albums/${albumData.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        youtubeResponse = await getPlaylistFromAlbum(youtubeId, albumData.name);

        const result = response.data;
        console.log(result);
        res.json(result);

    } catch (error) {
        console.error('Error in fetching artist data', error);
        res.status(500).send('Error in fetching artist data');
    }
};


