var express = require('express');
var router = express.Router();
var passport = require('passport')

// route for home page
router.get('/', (req, res, next) => {
    res.render('static/index', {
        user: req.user,
        index: true
    });
});

// route for logging out
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// email gets their emails
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/dashboard/',
        failureRedirect: '/'
    })
);

module.exports = router;