const Reaction = require('../database/models/reaction');

exports.addReaction = async (songTitle, reactionType) => {
    try {
        const reaction = new Reaction({
            songTitle,
            reactionType
        });
        await reaction.save();
        return reaction;
    } catch (error) {
        console.error("Error in addReaction:", error);
        throw error;
    }
};


exports.getReaction = async (songTitle) => {
    const reaction = await Reaction.findOne({ songTitle });
    return reaction;
};


exports.deleteReaction = async (songTitle) => {
    try {
        await Reaction.deleteOne({ songTitle });
    } catch (error) {
        console.error("Error in deleteReaction:", error);
        throw error;
    }
};



