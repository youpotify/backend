const express = require("express"); // express를 가져온다.
const app = express(); // express를 이용해서 app을 만들어준다.
const cors = require("cors");
const path = require('path');
require("dotenv").config();

const port = process.env.PORT; // port 번호를 8000번으로 설정
const connectDatabase = require("./database/connect"); // 데이터베이스 연결 파일 불러오기

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter.js");
const oauthRouter = require("./routes/oauthRouter.js");
const spotifyRoutes = require("./routes/spotifyRouter");
const youtubeRoutes = require("./routes/youtubeRouter");
const musicInfoRouter = require("./routes/musicInfoRoutes.js");
const searchRouter = require("./routes/searchRouter.js");
const playlistRouter = require("./routes/playlistRouter.js");
const reactionRouter = require('./routes/reactionRouter');
const weatherRouter = require("./routes/weatherRouter.js");


connectDatabase();
// const { database } = require("./database/connect.js");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auths", authRouter);
app.use("/api/oauths", oauthRouter);
app.use("/spotify", spotifyRoutes);
app.use("/youtube", youtubeRoutes);
app.use("/api/search", searchRouter);
app.use('/playlist', playlistRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/reactions', reactionRouter);

app.use(musicInfoRouter);
app.use(weatherRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
