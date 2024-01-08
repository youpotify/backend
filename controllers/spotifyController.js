const { default: axios } = require('axios');
const spotifyService = require('../services/spotifyService');

exports.getToken = async (req, res) => {
    try {
        const token = await spotifyService.fetchToken();
        res.json({ accessToken: token });
    } catch (error) {
        console.error('Error getting Spotify token:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const accessToken = await spotifyService.fetchToken();
        const recommendations = await spotifyService.fetchRecommendations(accessToken);
        res.json(recommendations);
    } catch (error) {
        console.error('Error getting Spotify recommendations:', error);
        res.status(500).send('Internal Server Error');
    }
};

//인기차트 가져오기
//글로벌차트 id 37i9dQZEVXbMDoHDwVN2tF
exports.getTopChart = async (req, res) => {
    const token = await spotifyService.fetchSpotifyToken();
        const topChartUrl = 'https://api.spotify.com/v1/browse/categories/toplists/playlists?country=KR&limit=50';
        const globalchartsUrl = `https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF`;
    try{
        const response = await axios.get(globalchartsUrl,{
            headers: {
                'Authorization': `Bearer ${token}`
              }
        });

        console.log('Top chart :', response.data.tracks);
        res.status(200).json(response.data);
    } catch(error) {
        console.error('Error fetching Spotify Top Chart!', error);
        throw error;
    }
};
