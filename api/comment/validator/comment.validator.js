const { body } = require('express-validator');

class CommentValidator {
    createCommentValidationRules() {
        return [
            body('postId').notEmpty().withMessage('postId는 필수 입력 항목입니다.'),
            body('content').notEmpty().withMessage('content는 필수 입력 항목입니다.'),
        ];
    }

    updateCommentValidationRules() {
        return [
            body('commentId').notEmpty().withMessage('commentId는 필수 입력 항목입니다.'),
            body('content').notEmpty().withMessage('content는 필수 입력 항목입니다.'),
        ];
    }
}

module.exports = new CommentValidator();
