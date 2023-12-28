const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

let clientId = "";
let codeVerifier = "";
const redirectUri = "http://localhost:3000/callback";
const scope =
  "ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private";
const authUrl = new URL("https://accounts.spotify.com/authorize");

const generatePKCE = async (req) => {
  clientId = req;

  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  codeVerifier = generateRandomString(64);

  const sha256 = (plain) => {
    return crypto.createHash("sha256").update(plain).digest();
  };

  const base64encode = (input) => {
    return input
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const hashed = sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  return {
    message: "PKCE generated successfully!",
    redirect_uri: authUrl.toString(),
  };
};

const getTokens = async (code) => {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const tokenData = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  try {
    const response = await axios.post(tokenUrl, tokenData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const access_token = response.data.access_token;
    const refresh_token = response.data.refresh_token;

    return {
      tokens: { access_token, refresh_token },
    };
  } catch (error) {
    console.error("Error:", error);
    return "Authentication failed";
  }
};

module.exports = { generatePKCE, getTokens };
