var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('prints');
});

//Create a new 
router.get('/edit', function(req, res, next) {
	
	res.render('edit-print', { title: 'est' });
});

router.get('/edit/:id', function(req, res, next) {
	
	res.render('edit-print', { title: req.body });
	
	console.log('edit an existing one');
});

/*router.get('/:id', function(req, res, next) {
  res.render('edit-print');
	console.log('print id: ' + req.params.id)
});*/

router.post('/new', function(req, res, next) {
	
 return	res.render('edit-print');
	
	console.log('test')
	
	console.log("title: " + req.body.title);
	
	var db = req.db;
	
	var collection = db.get('prints');
	
	collection.insert({
		bohnID: 0,
		images : [],
		title: "",
		date: null,
		description: "",
		tags: [],
		subjects: [],
		collections: [],
		sources: []
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