var express = require('express');
var router = express.Router();

router.get('/', isLoggedIn, function(req, res, next) {
    res.render('dashboard/index', {
        user: req.user,
        title: "| Dashboard"
    });
});

router.get('/collections', isLoggedIn, function(req, res, next) {
    res.render('dashboard/collections', {
        user: req.user,
        title: '| Collections'
    });
});

router.get('/settings', isLoggedIn, function(req, res, next) {
    res.render('dashboard/settings', {
        user: req.user,
        title: '| Settings'
    });
});

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

module.exports = router;