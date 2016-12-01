var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/dashboard', isLoggedIn, function(req, res, next) {
		if(req.user.newUser == true) {
			res.redirect('/register');
		} else {
			res.render('user/profile', {
					user: req.user,
					title: '| Dashboard',
			})
		}
});

router.get('/register', isLoggedIn, function(req, res, next) {
	if(req.user.newUser) {
		res.render('user/register', {
			user: req.user,
			title: '| Welcome'
		});
	} else {
		res.redirect('/dashboard');
	};
});

router.post('/register', isLoggedIn, function(req, res, next) {
	userQueries.signUp(req.user.id, req.body.bio)
	.then(function(data) {
		req.user.newUser = false;
		res.redirect('/profile');
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

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
		return next();
	}
  res.redirect('/');
}

module.exports = router;
