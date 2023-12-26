import axios from "axios";
import cors from "cors";
import crypto from "crypto";
import express from "express";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

let clientId = "";
const redirectUri = "http://localhost:3000/callback";

const scope = "user-read-private user-read-email";
const authUrl = new URL("https://accounts.spotify.com/authorize");

app.get("/spotify/oauths/pkce", (req, res) => {
  clientId = req.query.text;
  console.log(clientId);
  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const codeVerifier = generateRandomString(64);

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

  // 이 URL을 브라우저에서 열어야 합니다.
  console.log("Open this URL in your browser:", authUrl.toString());

  res.send({ redirect_url: authUrl.toString() });

  // 이 부분은 웹 서버에서 처리해야 합니다.
  app.get("/spotify/oauths/tokens", async (req, res) => {
    let code = req.query.text; // URL 쿼리에서 인증 코드 받기
    console.log(code);

    const tokenUrl = "https://accounts.spotify.com/api/token";
    const tokenData = new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    });

    console.log(code);

    try {
      const response = await axios.post(tokenUrl, tokenData.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // 액세스 토큰 처리
      console.log(response.data);
      res.send(response.data);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Authentication failed");
    }
  });
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
