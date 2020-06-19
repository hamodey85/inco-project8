const User = require('../schema/schemaUser')
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authenticateJWT = (req, res, next) => {
    const token = req.session.token;

    if (token) {

        jwt.verify(token, config.secret, (err, user) => {
            if (err) {
                return res.status(200).render('account/login', {title: 'Connexion'});
            }

            req.user = user
            next();
        });
    } else {
        res.status(200).redirect('/user/login');
    }
};

const authenticateAdmin = (req, res, next) => {
    const token = req.session.token;

    if (token) {

        jwt.verify(token, config.secret,async (err, user) => {
            if (err) {
                return res.status(200).render('account/login', {title: 'Connexion'});
            }
            let _admin = await User.findOne({email: user.email,isAdmin:true})

            if(_admin){
                req.user = user

                next();
            }else{
                res.status(200).render('account/login', {title: 'Connexion'});
            }

        });
    } else {
        res.status(200).render('account/login', {title: 'Connexion'});
    }
};

const redirectIfAlreadyLogedIn = async (req, res,next) => {
    const token = req.session.token;

    if (token) {

        jwt.verify(token, config.secret, (err, user) => {
            if (err) return next()

            req.user = user;
            res.status(200).redirect('/')
        });
    } else {
     next()
    }
}
module.exports = {authenticateJWT,authenticateAdmin,redirectIfAlreadyLogedIn}