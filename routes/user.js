var express = require('express');
var router = express.Router();
var userQueries = require('../database/queries/user_queries')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/dashboard', isLoggedIn, function(req, res, next) {
    if (req.user.newUser == true) {
        res.redirect('/register');
    } else {
        res.render('dashboard/index', {
            user: req.user,
            title: '| Dashboard',
        });
    };
});

router.get('/dashboard/collections', isLoggedIn, function(req, res, next) {
    res.render('dashboard/collections', {
        user: req.user,
        title: '| Collections'
    });
});

router.get('/register', isLoggedIn, function(req, res, next) {
    if (req.user.newUser) {
        res.render('user/register', {
            user: req.user,
            title: '| Welcome'
        });
    } else {
        res.redirect('/dashboard');
    };
});

router.post('/register', isLoggedIn, function(req, res, next) {
    userQueries.signUp(req.user.id, req.body.about)
        .then(function(data) {
            req.user.newUser = false;
            res.redirect('/dashboard');
        })
        .catch(function(error) {
            return next(error);
        });
});

router.get('/settings', isLoggedIn, function(req, res, next) {
    res.render('user/settings', {
        user: req.user,
        title: '| Settings'
    });
});

router.get('/update', isLoggedIn, function(req, res, next) {
    res.render('user/update', {
        user: req.user,
        title: '| Update'
    });
});

router.post('/update', isLoggedIn, function(req, res, next) {

    let userInfo = {
        google_id: req.user.google_id,
        email: req.body.email,
        about: req.body.about
    };
    console.log(userInfo);
    userQueries.updateUser(userInfo)
        .then(function(data) {
            console.log("Updated User:", data);
            res.redirect('/user/dashboard');
        })
        .catch(function(error) {
            return next(error);
        });

});

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;