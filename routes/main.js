const user = require('./userController');
const ticket = require('./ticketController');
const admin = require('./admin');
const {authenticateJWT} = require('../auth/index')
var express = require('express');
var router = express.Router();



router.get('/', authenticateJWT,(req, res)=>{
    if(req.user) return res.redirect('/ticket')
    res.redirect('/user/login')
})
router.use('/admin', admin);
router.use('/user', user);
router.use('/ticket', ticket);


module.exports = router;