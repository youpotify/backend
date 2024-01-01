const youtubeService = require('../services/youtubeService');

exports.search = async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const video = await youtubeService.searchYouTube(searchQuery);
        res.json(video);
    } catch (error) {
        console.error('Error during YouTube search:', error);
        res.status(500).send('Internal Server Error');
    }
};
