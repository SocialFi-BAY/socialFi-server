const {body} = require('express-validator');

// 회원가입 유효성 검사 규칙
const registerValidationRules = [
    body('address').notEmpty().withMessage('Address is required'),
    body('chainId').notEmpty().withMessage('ChainId is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('nickname').notEmpty().withMessage('Nickname is required'),
    body('universityName').notEmpty().withMessage('universityName name is required'),
    body('collegeName').notEmpty().withMessage('College name is required'),
    body('degreeType').notEmpty().withMessage('Degree type is required'),
    body('departmentName').notEmpty().withMessage('Department name is required'),
];

module.exports = {registerValidationRules};
