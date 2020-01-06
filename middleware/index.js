var Campground = require('../models/campground');
var Comment = require('../models/comments');

var middlewareObj = {};

//middleware to checkCampgroundOwnerShip
middlewareObj.checkCampgroundOwnerShip = function(req, res, next) {
	//is user logged in
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err || !foundCampground) {
				req.flash('error', 'Campground not found');
				res.redirect('back');
			} else {
				//Does user won the Campground?
				if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash('error', "You Don't have the permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'Sorry you need to be logged In to do that!');
		res.redirect('back');
	}
};

//middleware to checkCommentOwnerShip
middlewareObj.checkCommentOwnerShip = function(req, res, next) {
	//is user logged in
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err || !foundComment) {
				req.flash('error', 'comment not found');
				res.redirect('back');
			} else {
				//Does user won the Comment
				if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash('error', "You don't have the permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'Sorry You need to be logged in to do that!');
		res.redirect('back');
	}
};
//middleware to keep track of logged user
middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'Sorry You need to be logged in to do that!');
	res.redirect('/login');
};

module.exports = middlewareObj;
