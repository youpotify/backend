const axios = require('axios');

const apiKey = 'AIzaSyCfb8qPUZZfL2kEPgXWTJHwXL1r_eWKxYU';

exports.searchYouTube = async (searchQuery) => {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
            part: 'snippet',
            maxResults: 1,
            q: searchQuery,
            type: 'video',
            videoCategoryId: '10',
            key: apiKey
        }
    });
    return response.data.items[0];
};
