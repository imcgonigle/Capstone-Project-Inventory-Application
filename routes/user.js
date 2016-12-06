var express = require('express');
var router = express.Router();
var userQueries = require('../database/queries/user_queries')

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

router.get('/dashboard/collections', (req, res, next) => {
    res.render('dashboard/collections', {
        user: req.user,
        title: '| Collections'
    });
});

router.get('/register', (req, res, next) => {
    if (req.user.newUser) {
        res.render('user/register', {
            user: req.user,
            title: '| Welcome'
        });
    } else {
        res.redirect('/dashboard');
    };
});

router.post('/register', (req, res, next) => {
    userQueries.signUp(req.user.id, req.body.about)
        .then(data => {
            req.user.newUser = false;
            res.redirect('/dashboard');
        })
        .catch(error => {
            return next(error);
        });
});

router.get('/settings', (req, res, next) => {
    res.render('user/settings', {
        user: req.user,
        title: '| Settings'
    });
});

router.get('/update', (req, res, next) => {
    res.render('user/update', {
        user: req.user,
        title: '| Update'
    });
});

router.post('/update', (req, res, next) => {

    let userInfo = {
        googleID: req.user.google_id,
        email: req.body.email,
        about: req.body.about,
        city: req.body.city
    };

    userQueries.updateUser(userInfo)
        .then(data => {
            res.redirect('/dashboard');
        })
        .catch(error => {
            return next(error);
        });
});

module.exports = router;