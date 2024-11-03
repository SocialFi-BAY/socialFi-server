const express = require('express');
const commentController = require('../controller/comment.controller');
const commentValidator = require('../validator/comment.validator');
const router = express.Router();

router.post('/', commentValidator.createCommentValidationRules(), commentController.createComment.bind(commentController));
router.put('/', commentValidator.updateCommentValidationRules(), commentController.updateComment.bind(commentController));
router.delete('/:id', commentController.deleteComment.bind(commentController));

module.exports = router;
