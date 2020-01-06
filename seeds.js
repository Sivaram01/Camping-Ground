var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comments');
var data = [
	{
		name: 'Seven Hills',
		image:
			'https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		description:
			' Jungle Camp is a serene camping site near Ooty set up against the backdrop of glistening waterfalls and dense forests. The area is known for its coffee, tea, spices and rosemary cultivation, and the vast expanse of lush green fields en route is a treat to the eyes. The region is also home to some exotic wildlife, and if you are in luck, you may be able to spot some elephants, tigers or bears during your outing. Do try your hand at rock climbing and fishing at the camping site. The camp also organizes treks, campfires and jeep safaris for guests.'
	},
	{
		name: ' Queen of Hills',
		image:
			'https://images.unsplash.com/photo-1457368406279-ec1ecb478381?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		description:
			' Freshly ploughed fields, walking trails crisscrossing thickets, and sounds of birds and animals await you here. You can trek into the forests, go mountain biking, spend a quiet morning bird watching, or indulge in sports like paragliding. Wind up the day with some rum by the campfire, and spend the night on a machaan or in your cozy tent.'
	},
	{
		name: 'Mountain View',
		image:
			'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		description:
			'The camping site has been tastefully done up to recreate the aristocratic vibe and regal hospitality Rajasthan is known for. Luxurious bonfires, delectable Rajasthani food, folk music and dance performances by local musicians are the highlights of the camping experience here. The destination is a bird watchers’ delight, as you can spot some rare species like Laughing Dove, Yellow-Wattled Lapwing, Grey Francolin as well as musters of peacocks.'
	}
];
function seedDB() {
	//Remove all campgrounds
	Campground.deleteMany({}, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('removed campgrounds!');
			//add new campground
			data.forEach(function(seed) {
				Campground.create(seed, function(err, campground) {
					if (err) {
						console.log(err);
					} else {
						console.log('added a new Campground');
						// Add new comments
						Comment.create(
							{
								text: 'This Place is awesome but I wish there was internet',
								author: 'page'
							},
							function(err, comment) {
								if (err) {
									console.log(err);
								} else {
									campground.comments.push(comment);
									campground.save();
									console.log('created a new comment');
								}
							}
						);
					}
				});
			});
		}
	});
}
module.exports = seedDB;
