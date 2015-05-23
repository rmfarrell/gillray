var express = require('express');
var router = express.Router();


//Middleware
function checkUnique(req, res, next) {

	req.db.get('prints').find({bohnID: req.body.id}, function(err, doc) {

		if (err) return next(err);

		if (doc.length > 0) return next(new Error('User is not unique'));

		next();
	});
}

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

router.get('/admin/tags', function(req, res, next) {

	var tags = req.db.get('tags');

	tags.find({}, function(err, docs) {

		if (err) console.log(err);

			else res.send(docs);
	});
});

router.post('/admin/tags/new', function(req, res, next) {

	var tag = req.body.tag;

	req.db.get('tags').insert({
		name: tag
	}, function(err, doc) {

		if (err) console.log(err);

			else res.send(doc).end();
	});
});

router.post('/admin/tags/remove', function(req, res, next) {

	req.db.get('tags').remove({
		_id: req.body.id
	}, function(err, status) {

		if (err) console.log(err);

			else res.sendStatus(200).end()
	})
});

router.post('/admin/subjects/new', function(req, res, next) {

	var _subject = req.body.subject;

	req.db.get('subjects').insert(_subject, function(err, doc) {

		if (err) console.log(err);

			else res.send(doc).end();
	});
});

router.post('/admin/subjects/update/:id', function(req, res, next) {

	console.log(req.body.subject)

	req.db.get('subjects').update({

		_id: req.params['id']

	}, req.body.subject, function(err, doc) {

		if (err) console.log(err)

			else console.log(doc);
	})
});

router.post('/admin/subjects/remove', function(req, res, next) {

	req.db.get('subjects').remove({
		_id: req.body.id
	}, function(err, status) {

		if (err) console.log(err);

			else res.sendStatus(200).end()
	});
});

router.get('/admin/subjects', function(req, res, next) {

	var subjectsCollection = req.db.get('subjects');

	subjectsCollection.find({}, function(err, docs) {

		if (err) console.log(err);

			else res.send(docs);
	});
})

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

	  	console.log(err);
			
	  } else {

	  	console.log('wrote doc', doc);
	  }
	});
});

module.exports = router;