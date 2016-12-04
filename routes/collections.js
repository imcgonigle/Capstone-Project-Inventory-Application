var express = require('express');
var router = express.Router();

router.get('/', isLoggedIn(), function(req, res, next) {
    res.render('/collection/index', {
      user: req.user,
      title: "| Collections"
    });
});

module.exports = router;