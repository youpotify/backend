const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reactionController');

router.post('/', reactionController.addReaction);
router.get('/:songTitle', reactionController.getReaction);
router.delete('/:songTitle', reactionController.deleteReaction);


module.exports = router;
