var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//Root Routes
router.get('/', function(req, res) {
	res.render('landing');
});

//Auth Routes
//show Sign-up form
router.get('/register', function(req, res) {
	res.render('register', { page: 'register' });
});
//handles sign-up logic

router.post('/register', function(req, res) {
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		avatar: req.body.avatar
	});
	if (req.body.adminCode === 'Edith01') {
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function() {
			req.flash('success', 'Welcome To YelpCamp' + '' + user.username);
			res.redirect('/campgrounds');
		});
	});
});

//show login page
router.get('/login', function(req, res) {
	res.render('login', { page: 'login' });
});
//Handling login logic
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		successFlash: 'welcome Back to YelpCamp',
		failureRedirect: '/login',
		failureFlash: true
	}),
	function(req, res) {}
);

//logout route
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'Logged out');
	res.redirect('/campgrounds');
});

//User profile
router.get('/users/:id', function(req, res) {
	User.findById(req.params.id, function(err, founduser) {
		if (err) {
			req.flash('error', 'Something went wrong!');
			return res.redirect('/');
		} else {
			res.render('users/show', { user: founduser });
		}
	});
});

module.exports = router;
