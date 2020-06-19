const User = require('../../schema/schemaUser.js');

function signup(req, res) {
    if (!req.body.email || !req.body.password || !req.body.isAdmin) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        res.status(400).json({
            "text": "invalid Request"
        })
    } else {

        var user = {
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin === "yes"? true : false
        }
        var findUser = new Promise(function (resolve, reject) {
            User.findOne({
                email: user.email
            }, function (err, result) {
                if (err) {
                    reject(500);
                } else {
                    if (result) {
                        reject(200)
                    } else {
                        resolve(true)
                    }
                }
            })
        })

        findUser.then(function () {
            var _u = new User(user);
            _u.save(function (err, user) {
                if (err) {
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                } else {
                    req.session.token = user.getToken();
                    res.redirect('../../ticket/');
                }
            })
        }, function (error) {
            switch (error) {
                case 500:
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                    break;
                case 200:
                    res.status(200).json({
                        "text": "L'adresse email existe déjà"
                    })
                    break;
                default:
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
            }
        })
    }
}

function signupForm(req, res) {
    res.status(200).render('account/adminsignup', {title: 'Inscription',admin:req.user.isAdmin || false});
}



exports.signup = signup;
exports.signupForm = signupForm;
