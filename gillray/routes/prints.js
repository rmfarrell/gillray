var express = require('express');
var router = express.Router();

/*
	PRINTS SCHEMA

	images : [],
	title: "",
	year: 0,
	description: "",
	tags: []
*/

router.get('/', function(req, res, next) {
  res.render('prints');
});

//Create a new 
router.get('/edit', function(req, res, next) {
	
	res.render('edit-print', { title: req.body });
});

router.get('/edit/:id', function(req, res, next) {
	
	console.log('edit an existing one');
});

router.get('/:id', function(req, res, next) {
  res.render('edit-print');
	console.log('print id: ' + req.params.id)
});

router.post('/new', function(req, res, next) {
	
	return console.log("title: " + req.body.title);
	
	var db = req.db;
	
	var collection = db.get('prints');
	
	collection.insert({
			images : [],
			title: "test title",
			year: 0,
			description: "",
			tags: []
		}, function (err, doc) {
			
	  	if (err) {
	      // If it failed, return error
	      res.send("index");
	  	}
	  	else {
				
				console.log(doc)
	  	}
	});
	
 // res.render('index', { title: req.body });
});

module.exports = router;