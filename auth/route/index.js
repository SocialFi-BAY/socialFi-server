const express = require('express');
const router = express.Router();
const controller = require('../controller/auth.controller');
const {registerValidationRules} = require('../validator/auth.validator');

router.get('/login', controller.getLogin);
router.post('/register', registerValidationRules, controller.register);
router.get('/isLoggedIn', controller.isLoggedIn);
router.post('/login', controller.postLogin);

module.exports = router;


