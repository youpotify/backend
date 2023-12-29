const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const albumRoutes = require('./albumRouter');
// const artistRoutes = require('./artistRouter');
const routes = require('./routes');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {

console.log(`Server running on http://localhost:${port}`);
});