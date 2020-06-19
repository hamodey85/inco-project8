const {authenticateAdmin} = require('../auth/index')
const {signupForm,signup} = require('../controllers/admin/lib');

var express = require('express');
var router = express.Router();


router.post('/signup',authenticateAdmin,signup);
router.get('/signup',authenticateAdmin,signupForm);

module.exports = router;