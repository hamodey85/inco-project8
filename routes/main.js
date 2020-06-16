const user = require('./userController');
const ticket = require('./ticketController');
var express = require('express');
var router = express.Router();



router.use('/user', user);

router.use('/ticket', ticket);

module.exports = router;