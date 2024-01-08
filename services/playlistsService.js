// services/playlistsService.js
const UserPlaylist = require('../database/models/playlist');

const createPlaylist = async (data) => {
    const newPlaylist = new UserPlaylist(data);
    await newPlaylist.save();
    return newPlaylist;
};

module.exports = {
    createPlaylist
};
