var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment = require('../models/comments');
var middleware = require('../middleware');

//Comment Route
//show comments form
router.get('/new', middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

//create route for comment
router.post('/', middleware.isLoggedIn, function(req, res) {
	//lookup campground by it's id
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			//create a new comment
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash('error', 'something went wrong');
					console.log(err);
					res.redirect('/campgrounds');
				} else {
					//add username  and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save to comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'successfully added comment');
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//Edit route for comments
router.get('/:comment_id/edit', middleware.checkCommentOwnerShip, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash('error', 'Campground not found');
			return res.redirect('back');
		}
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect('back');
			} else {
				res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
			}
		});
	});
});

//Update Route for comments
router.put('/:comment_id', middleware.checkCommentOwnerShip, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//Destroy Route for comments
router.delete('/:comment_id', middleware.checkCommentOwnerShip, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;
