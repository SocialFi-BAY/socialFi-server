const express = require('express');
const router = express.Router();
const postController = require('../controller/post.controller');
const {createPostValidationRules, updatePostValidationRules} = require('../validator/post.validator'); // require 문 추가

// 게시글 작성
router.post('/', createPostValidationRules, postController.createPost.bind(postController));

// 게시글 조회
router.get('/:id', postController.getPostById.bind(postController));

// 게시글 수정
router.put('/:id', updatePostValidationRules, postController.updatePost.bind(postController));

// 게시글 삭제
router.delete('/:id', postController.deletePost.bind(postController));


module.exports = router;
