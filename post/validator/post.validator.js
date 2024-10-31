const {body, param} = require('express-validator');

const createPostValidationRules = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string'),

    body('content')
        .notEmpty().withMessage('Content is required')
        .isString().withMessage('Content must be a string'),

    body('photos')
        .isArray().withMessage('Photos must be an array')
        .custom((photos) => {
            if (photos.length > 0 && !photos.every(photo => typeof photo === 'string')) {
                throw new Error('All photos must be URLs (strings)');
            }
            return true;
        })
];

// 게시글 수정 유효성 검사
const updatePostValidationRules = [
    param('id')
        .isInt().withMessage('Post ID must be an integer'),

    body('title')
        .optional()
        .isString().withMessage('Title must be a string')
        .isLength({max: 100}).withMessage('Title can be at most 100 characters'),

    body('content')
        .optional()
        .isString().withMessage('Content must be a string'),

    body('photos')
        .optional()
        .isArray().withMessage('Photos must be an array')
        .custom((photos) => {
            if (photos.length > 0 && !photos.every(photo => typeof photo === 'string')) {
                throw new Error('All photos must be URLs (strings)');
            }
            return true;
        })
];

module.exports = {createPostValidationRules, updatePostValidationRules};

