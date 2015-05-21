var express = require('express');
var router = express.Router();

router.get('/print/:id', function(req, res, next) {
	
	var db = req.db;
	
	var collection = db.get('prints');
	
	collection.find({
		bohnID: req.params["id"]
	}, function (err, doc) {
			
	  if (err) console.log(error)
			
			else res.send(doc)
	});
});

function checkUnique(req, res, next) {

	req.db.get('prints').find({bohnID: req.body.id}, function(err, doc) {

		if (err) return next(err);

		if (doc.length > 0) return next(new Error('User is not unique'));

		next();
	});
}

router.post('/new', checkUnique, function(req, res, next) {

	var db = req.db;
	
	var collection = db.get('prints');
	
	collection.insert({
		bohnID: req.body.id,
		images : req.body.images,
		title: req.body.title,
		date: req.body.date,
		description: req.body.description,
		tags: req.body.tags,
		subjects: req.body.subjects,
		collections: req.body.collections,
		sources: req.body.sources
	}, function (err, doc) {
			
	  if (err) {

	  	console.log(err)
	  }
	  else {

	  	console.log('wrote doc', doc)
	  }
	});
});

module.exports = router;