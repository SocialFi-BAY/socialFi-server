const express = require('express');
const reactionController = require('../controller/reaction.controller');

const router = express.Router();

router.post('/', reactionController.createReaction);
router.delete('/', reactionController.deleteReaction);

module.exports = router;
