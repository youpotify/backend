const axios = require('axios');

exports.fetchArtistInfo = async (artistName) => {
    try{
        //위키피디아 API에 아티스트 검색
        const response = await axios.get("https://en.wikipedia.org/w/api.php", {
            params : {
                action: 'query',
                format: 'json',
                titles: `${artistName}`,
                prop: 'extracts',
                exintro: true,
                explaintext: true,
            }
        });
        
        //아티스트 정보 추출
        const pages = response.data.query.pages; //page 객체 가져오기
        const pageId = Object.keys(pages)[0]; // pageId 가져오기
        const artistInfo = pages[pageId].extract; //페이지의 텍스트 요약부분 가져오기

        console.log('artist info:' , artistInfo);
        return artistInfo
    } catch(error) {
        console.error('Error fetching artist info', error);
    }
};



