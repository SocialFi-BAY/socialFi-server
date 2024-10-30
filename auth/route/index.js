const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const emailController = require('../controller/email.controller');
const {registerValidationRules} = require('../validator/auth.validator');

// Auth Routes
router.get('/login', authController.getLogin);
router.post('/register', registerValidationRules, authController.register);
router.get('/isLoggedIn', authController.isLoggedIn);
router.post('/login', authController.postLogin);
router.post('/refresh', authController.refresh);

// Email Verification Routes
router.post('/verification-code', emailController.sendVerificationCode);
router.post('/verification-code/check', emailController.checkVerificationCode);

module.exports = router;