const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const emailController = require('../controller/email.controller');
const { registerValidationRules } = require('../validator/auth.validator');

// Auth Routes
router.get('/login', authController.getLogin.bind(authController));
router.post('/register', registerValidationRules, authController.register.bind(authController));
router.get('/isLoggedIn', authController.isLoggedIn.bind(authController));
router.post('/login', authController.postLogin.bind(authController));
router.post('/refresh', authController.refresh.bind(authController));

// Email Verification Routes
router.post('/verification-code', emailController.sendVerificationCode.bind(emailController));
router.post('/verification-code/check', emailController.checkVerificationCode.bind(emailController));

module.exports = router;
