const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());

// 스포티파이 토큰 가져오기
const fetchSpotifyToken = async () => {
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

// 아티스트 검색 라우트
app.get('/search', async (req, res) => {
    const artistName = req.query.term;
    if (!artistName) {
        return res.status(400).send('Artist name is required');
    }

    const token = await fetchSpotifyToken();
    if (!token) {
        return res.status(500).send('Unable to fetch Spotify token');
    }

    try {
        const searchResponse = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                q: artistName,
                type: 'artist'
            }
        });

        const artist = searchResponse.data.artists.items[0];
        if (!artist) {
            return res.status(404).send('Artist not found');
        }

        const [topTracksResponse, albumsResponse] = await Promise.all([
            axios.get(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=kr`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            axios.get(`https://api.spotify.com/v1/artists/${artist.id}/albums`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
        ]);

        const result = {
            name: artist.name,
            id: artist.id,
            img: artist.images[0]?.url,
            artistInfo: artist.uri,
            songs: topTracksResponse.data.tracks,
            albums: albumsResponse.data.items
        };
        console.log(result.artistInfo);
        res.json(result);
    } catch (error) {
        console.error('Error in fetching artist data', error);
        res.status(500).send('Error in fetching artist data');
    }
});

app.get('/album', async (req, res) => {
    const albumId = req.query.id;
    if(!albumId){
        return res.status(400).send('Album ID is required');
    }

    const token = await fetchSpotifyToken();
    if (!token) {
        return res.status(500).send('Unable to fetch Spotify token');
    }

    try {
        const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        const result = response.data;
        console.log(result);
        res.json(result);

    } catch (error) {
        console.error('Error in fetching artist data', error);
        res.status(500).send('Error in fetching artist data');
    }

});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});