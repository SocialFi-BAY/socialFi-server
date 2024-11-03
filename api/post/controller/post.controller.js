const postService = require('../service/post.service');
const {validationResult} = require('express-validator');

class PostController {

    async createPost(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const userId = req.user.userId;
            const {title, content, photos} = req.body;
            const postResponse = await postService.createPost({title, content, photos, userId});
            res.status(201).json(postResponse);
        } catch (error) {
            console.error(error.message)
            res.status(500).json({error: error.message});
        }
    }

    async getPostById(req, res) {
        try {
            const {id} = req.params;
            const userId = req.user.userId;
            const post = await postService.getPostById(parseInt(id), userId);
            res.status(200).json(post);
        } catch (error) {
            const statusCode = error.status || 500;
            console.error(error.message)
            res.status(statusCode).json({message: error.message});
        }
    }

    async updatePost(req, res) {
        try {
            const userId = req.user.userId;
            const {id} = req.params;
            const {title, content, photos} = req.body;
            const post = await postService.updatePost(id, userId, {title, content, photos});
            res.status(200).json(post);
        } catch (error) {
            console.error(error.message)
            res.status(500).json({error: error.message});
        }
    }

    async deletePost(req, res) {
        try {
            const userId = req.user.userId;
            const {id} = req.params;
            await postService.deletePost(id, userId);
            res.status(200).json({message: 'Post deleted successfully'});
        } catch (error) {
            console.error(error.message)
            res.status(500).json({error: error.message});
        }
    }

}

module.exports = new PostController();
