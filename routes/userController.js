const account = require('../controllers/account/lib.js');
const {redirectIfAlreadyLogedIn} = require('../auth/index')
var express = require('express');
var router = express.Router();

router.get('/login',redirectIfAlreadyLogedIn,account.loginForm);
router.post('/login',account.login);
router.get('/signup',redirectIfAlreadyLogedIn,account.signupForm);
router.post('/signup',account.signup);
router.get('/signout',account.signout);

module.exports = router;