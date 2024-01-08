const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: String,
  visibility: {
    type: String,
    enum: ['public', 'private'],

  },
  image: String,

}, { collection: 'UserPlaylist' });

module.exports = mongoose.model('UserPlaylist', playlistSchema);