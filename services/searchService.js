const axios = require("axios");
require("dotenv").config();

let searchResult = { youtube: {}, spotify: {} };

// 유튜브 + 스포티파이 결과
const getSearchResult = async (accessToken, searchKeyword) => {
  // try ~ catch 문 보완 필요
  try {
    await fetchYoutube(searchKeyword);
  } catch (err) {
    console.log(err);
  }

  // try ~ catch 문 보완 필요
  try {
    await fetchSpotify(accessToken, searchKeyword);
  } catch {
    console.log("error");
  }

  console.log(searchResult.youtube);
  if (searchResult.youtube && searchResult.spotify)
    return { message: "Fetched search results successfully", searchResult };
};

// 유튜브 호출
const fetchYoutube = async (searchKeyword) => {
  const options = {
    method: "GET",
    url: "https://youtube-v31.p.rapidapi.com/search",
    params: {
      q: searchKeyword,
      part: "snippet,id",
      regionCode: "US",
      maxResults: "3",
      order: "date",
    },
    headers: {
      "X-RapidAPI-Key": `${process.env.X_RAPIDAPI_KEY}`,
      "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    // api 호출 결과 저장
    searchResult.youtube = response.data.items;
  } catch (error) {
    console.error(error);
  }
};

// 스포티파이 호출
const fetchSpotify = async (accessToken, searchKeyword) => {
  const searchResponse = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { q: `artist:${searchKeyword}`, type: "artist" },
  });
  // artist ID 추출
  const artistId = searchResponse.data.artists.items[0].id;
  // artist ID를 이용한 top tracks 호출
  const topTracksResponse = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  // api 호출 결과 저장
  searchResult.spotify = topTracksResponse.data.tracks;
};

module.exports = { getSearchResult };
