const axios = require('axios');


const clientId = '';
const clientSecret = '';
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

const querystring = require('querystring');

exports.fetchSpotifyToken = async () => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

    try {
        const response = await axios.post(tokenUrl, querystring.stringify({ grant_type: 'client_credentials' }), {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching Spotify token', error);
        return null;
    }
};

