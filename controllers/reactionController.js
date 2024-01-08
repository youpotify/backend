const reactionService = require('../services/reactionService');

exports.addReaction = async (req, res) => {
    try {
        // console.log("Text fields:", req.body); // 텍스트 필드 로그 출력

        const { songTitle, reactionType } = req.body;
        const newReaction = await reactionService.addReaction(songTitle, reactionType);
        res.status(201).json(newReaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("에러가 발생했습니다.");
    }
};

exports.getReaction = async (req, res) => {
    try {

        const { songTitle } = req.params;
        const reaction = await reactionService.getReaction(songTitle);
        res.status(200).json(reaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteReaction = async (req, res) => {
    try {

        const { songTitle } = req.params;
        await reactionService.deleteReaction(songTitle);
        res.status(200).json({ message: 'Reaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

