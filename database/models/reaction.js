const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    songTitle: {
        type: String,
        required: true
    },
    reactionType: {
        type: String,
        required: true,
        enum: ['like', 'dislike']
    }

}, { collection: 'UserReaction' });

module.exports = mongoose.model('UserReaction', reactionSchema);
