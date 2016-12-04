var express = require('express');
var router = express.Router();

router.get('/', isLoggedIn(), function(req, res, next) {
    res.render('/dashboard/index', {
        user: req.user,
        title: "| Dashboard"
    });
});

module.exports = router;