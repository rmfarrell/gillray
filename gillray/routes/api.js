var express = require('express');
var router = express.Router();

router.get('/print/:id', function(req, res, next) {
	
	var db = req.db;
	
	var collection = db.get('prints');
	
	collection.find({
		bohnID: req.param("id")
	}, function (err, doc) {
			
	  if (err) console.log(error)
			
			else res.send(doc)
	});
});

router.post('/new', function(req, res, next) {

	function uniqueID() {
		
		return true;
	};
	
 	//return	res.render('edit-print');
	
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
			// If it failed, return error
			res.send("index");
	  }
	  else {
			
			if (uniqueID()) {
				
				console.log(doc)
			}
	  }
	});
});

module.exports = router;