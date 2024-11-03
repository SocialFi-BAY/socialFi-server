const { validationResult } = require('express-validator');
const commentService = require('../service/comment.service');

class CommentController {
    async createComment(req, res) {
        // 유효성 검사 결과 확인
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { postId, content, parentId } = req.body;
        const userId = req.user.userId;

        try {
            const comment = await commentService.createComment({ userId, postId, content, parentId });
            res.status(201).json(comment);
        } catch (error) {
            console.error('Error creating comment:', error.message);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async updateComment(req, res) {
        // 유효성 검사 결과 확인
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { commentId, content } = req.body;
        const userId = req.user.userId;

        try {
            const comment = await commentService.updateComment(commentId, userId, content);
            res.json(comment);
        } catch (error) {
            console.error('Error updating comment:', error.message);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async deleteComment(req, res) {
        const { id } = req.params;
        const userId = req.user.userId;

        try {
            await commentService.deleteComment(parseInt(id), userId);
            res.json({ message: 'Comment has been deleted.' });
        } catch (error) {
            console.error('Error deleting comment:', error.message);
            res.status(error.status || 500).json({ error: error.message });
        }
    }
}

module.exports = new CommentController();
