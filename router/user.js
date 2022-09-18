const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

const validator = require('../middlewares/validation');
const { isAuth } = require('../middlewares/auth');

router.post('/signup', validator.signUp, userController.postSignup);

router.post('/signin', validator.signIn, userController.postSignin);

router.get('/profile', isAuth, userController.getProfile);

module.exports = router;