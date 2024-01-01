const axios = require('axios');


// const apiKey = '';

// exports.searchYouTube = async (searchQuery) => {
//     const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//         params: {
//             part: 'snippet',
//             maxResults: 1,
//             q: searchQuery,
//             type: 'video',
//             videoCategoryId: '10',
//             key: apiKey
//         }
//     });
//     return response.data.items[0];
// };

   exports.searchYoutube = async (query) => {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/search';
    // console.log(`쿼리 : ${query}`);
    try {
        const response = await axios.get(apiUrl, {
            params: {
                part: 'snippet',
                maxResults: 20,
                q: query,
                type: 'channel',
                key: process.env.YOUTUBE_API_KEY
            }
        });
        const channels = response.data.items;

        // '공식' 또는 'official' 단어가 포함된 채널 찾기
        const officialChannels = channels.filter(channel => 
            channel.snippet.channelTitle.toLowerCase().includes('공식') || 
            channel.snippet.channelTitle.toLowerCase().includes('official') ||
            channel.snippet.description.toLowerCase().includes('공식') ||
            channel.snippet.description.toLowerCase().includes('official')
        );

        // 첫 번째 공식 채널의 ID 반환
        if (officialChannels.length > 0) {
            //console.log(`채널id : ${officialChannels[0].snippet.channelId}`);
            return officialChannels[0].snippet.channelId;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching YouTube data', error);
        throw error;
    }
   };

//    //search 대신 channel 사용하기
//     exports.getVideoIdFromChannel = async (channelId, videoTitle) => {
//         const channelInfoUrl = `https://www.googleapis.com/youtube/v3/channels`; 
        
//         // 채널의 업로드 플레이리스트 ID 가져오기
//         try {
//             const channelResponse = await axios.get(channelInfoUrl, {
//                 params: {
//                     part: 'contentDetails',
//                     id: channelId,
//                     key: process.env.YOUTUBE_API_KEY
//                 }
//             });

//             const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

//             // 업로드 플레이리스트에서 동영상 목록 가져오기
//             const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems`;
//             const playlistItemsResponse = await axios.get(playlistItemsUrl, {
//                 params: {
//                     part: 'snippet',
//                     playlistId: uploadsPlaylistId,
//                     maxResults: 50,
//                     key: process.env.YOUTUBE_API_KEY
//                 }
//             });

//             // 특정 제목을 가진 동영상 찾기
//             const videoItem = playlistItemsResponse.data.items.find(item => 
//                 item.snippet.title.toLowerCase() === videoTitle.toLowerCase()
//             );

//             return videoItem ? videoItem.snippet.resourceId.videoId : null;
//         } catch (error) {
//             console.error('Error fetching videos from channel', error);
//             throw error;
//         }
//     };

    exports.getVideoIdFromChannel = async (channelId, videoTitle) => {
        const channelInfoUrl = `https://www.googleapis.com/youtube/v3/channels`;
        console.log(`넘겨받은 채널id : ${channelId}`); 
        
        try {
            // 채널의 업로드 플레이리스트 ID 가져오기
            const channelResponse = await axios.get(channelInfoUrl, {
                params: {
                    part: 'contentDetails',
                    id: channelId,
                    key: process.env.YOUTUBE_API_KEY
                }
            });

            if(!channelResponse || !channelResponse.data || !channelResponse.data.items) {
                console.error('No data return from Youtube API!!');
                return null;
            }

            if (!channelResponse.data.items[0]) {
                console.error('No items found in Youtube API response!!!');
                return null;
            }
    
            const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
    
            // 업로드 플레이리스트에서 동영상 목록 가져오기
            const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems`;
            let nextToken;
            let videoId = null;
    
            do {
                const playlistItemsResponse = await axios.get(playlistItemsUrl, {
                    params: {
                        part: 'snippet',
                        playlistId: uploadsPlaylistId,
                        maxResults: 50,
                        pageToken: nextToken,
                        key: process.env.YOUTUBE_API_KEY
                    }
                });
    
                // 특정 제목을 가진 동영상 찾기
                const videoItem = playlistItemsResponse.data.items.find(item => 
                    item.snippet.title.toLowerCase().includes(videoTitle.toLowerCase())
                );
    
                if (videoItem) {
                    videoId = videoItem.snippet.resourceId.videoId;
                    break;
                }
    
                nextToken = playlistItemsResponse.data.nextPageToken;
            } while (nextToken);
    
            return videoId;
        } catch (error) {
            console.error('Error fetching videos from channel', error);
            throw error;
        }
    };

    //아티스트 채널의 이용해서 앨범정보 가져오기(앨범명과 동일한 채널의 재생목록 반환하기)
    exports.getPlaylistFromAlbum = async (channelId ,albumTitle) => {
        console.log(albumTitle);
        //플레이리스트로 요청 -> 반환된 플레이리스트 중 snippet의 title이 앨범제목과 동일한 플레이리스트의 id 반환하기
        const playlistInfoUrl = `https://www.googleapis.com/youtube/v3/playlists`;

        try{
            const playListResponse = await axios.get(playlistInfoUrl, {
                params: {
                    part: 'snippet',
                    channelId: channelId,
                    maxResults : 50, //max
                    key: process.env.YOUTUBE_API_KEY
                }
            });

            console.log(`playlistResponse : ${JSON.stringify(playListResponse.data)}`);

            //playListResponse의 data의 items 중 localized의 title이 albumTitle과 같은 항목의 id 반환하기
            const matchingPlaylist = playListResponse.data.items.find(item => 
                item.snippet.title.toLowerCase() === albumTitle.toLowerCase()
            );
    
            if (matchingPlaylist) {
                console.log(`플레이리스트 id : ${matchingPlaylist.id}`);
                return matchingPlaylist.id;
            } else {
                console.log("No matching playlist found");
                return null;
            }


        } catch(error) {
            console.error('Error fetching YouTube data', error);
            throw error;
        }


    };

