const axios = require('axios');
const spotifyService = require('../services/spotifyService');
const youtubeService = require('../services/youtubeService');

exports.searchArtist = async (req, res) => {
    const artistName = req.query.term;
    if (!artistName) {
        return res.status(400).send('Artist name is required');
    }

    try {
        const spotifyToken = await spotifyService.fetchSpotifyToken();
        if (!spotifyToken) {
            return res.status(500).send('Unable to fetch Spotify token');
        }

        // 스포티파이에서 아티스트 검색
        const searchResponse = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: {
                'Authorization': `Bearer ${spotifyToken}`
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

        // 스포티파이에서 아티스트의 톱 트랙과 앨범 정보 가져오기
        const [topTracksResponse, albumsResponse] = await Promise.all([
            axios.get(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=kr`, {
                headers: { 'Authorization': `Bearer ${spotifyToken}` }
            }),
            axios.get(`https://api.spotify.com/v1/artists/${artist.id}/albums`, {
                headers: { 'Authorization': `Bearer ${spotifyToken}` }
            })
        ]);

        const songs = topTracksResponse.data.tracks;
        const youtubeChannelId = await youtubeService.searchYoutube(artistName);

        // 유튜브 동영상 ID를 각 트랙에 추가
        for (let track of songs) {
            console.log(`노래제목은 ${track.name}`);
            const videoId = await youtubeService.getVideoIdFromChannel(youtubeChannelId, track.name); // youtubeChannelId는 해당 아티스트의 유튜브 채널 ID
            track.youtubeId = videoId; // 유튜브 ID 추가
        }

        const result = {
            spotify: {
                name: artist.name,
                id: artist.id,
                img: artist.images[0]?.url,
                artistInfo: artist.uri,
                songs: songs, // 유튜브 ID가 추가된 트랙 리스트
                albums: albumsResponse.data.items
            },
            youtubeId : youtubeChannelId 
        };

        // 결과 반환
        res.json(result);
    } catch (error) {
        console.error('Error in fetching artist data', error);
        res.status(500).send('Error in fetching artist data');
    }
};
