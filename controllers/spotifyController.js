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
