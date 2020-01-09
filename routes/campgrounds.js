var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comments');
var middleware = require('../middleware');

//Index Route
router.get('/', function(req, res) {
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		//Get All Campgrounds from database
		Campground.find({ name: regex }, function(err, allCampgrounds) {
			if (err) {
				console.log(err);
			} else {
				res.render('campgrounds/index', { campgrounds: allCampgrounds, page: 'campgrounds' });
			}
		});
	} else {
		//Get All Campgrounds from database
		Campground.find({}, function(err, allCampgrounds) {
			if (err) {
				console.log(err);
			} else {
				res.render('campgrounds/index', { campgrounds: allCampgrounds, page: 'campgrounds' });
			}
		});
	}
});
//Create Route
router.post('/', middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampgrounds = { name: name, image: image, description: desc, author: author };

	Campground.create(newCampgrounds, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});
//New Route
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});
//Show Route
router.get('/:id', function(req, res) {
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash('error', 'Campground not found!');
			res.redirect('back');
		} else {
			res.render('campgrounds/show', { campground: foundCampground });
		}
	});
});

//Edit Route
router.get('/:id/edit', middleware.checkCampgroundOwnerShip, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash('error', 'Campground not found!');
			res.redirect('back');
		} else {
			res.render('campgrounds/edit', { campground: foundCampground });
		}
	});
});

//Update Routes
router.put('/:id', middleware.checkCampgroundOwnerShip, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//Destroy Route
router.delete('/:id', middleware.checkCampgroundOwnerShip, function(req, res) {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			// if there are comments, delete comments first
			if (foundCampground.comments.length > 0) {
				foundCampground.comments.forEach((comment) => {
					Comment.findByIdAndRemove(comment, (err) => {
						if (err) {
							console.log(err);
						}
					});
				});
			}
		}
	});
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Campground deleted');
			res.redirect('/campgrounds');
		}
	});
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;
