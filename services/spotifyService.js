const axios = require('axios');

const clientId = '5eef7a15d6774d76bc4299388e75e8af';
const clientSecret = '11402bc3c70c473b8f118b741af562d5';
const authString = `${clientId}:${clientSecret}`;
const authBase64 = Buffer.from(authString).toString('base64');

exports.fetchToken = async () => {
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authBase64}`
        }
    });
    return response.data.access_token;
};

exports.fetchRecommendations = async (accessToken) => {
    const response = await axios.get('https://api.spotify.com/v1/recommendations', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            seed_genres: 'pop',
            limit: 13
        }
    });
    return response.data.tracks;
};
