var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('prints');
});

//Create a new 
router.get('/new', function(req, res, next) {
	
	res.render('edit-print', { title: 'New Print' });
});

router.get('/edit/:id', function(req, res, next) {
	
	res.render('edit-print', { 
		title: "print-" + req.param("id")
	});
});

router.get('/edit', function(req, res, next) {
	
	res.redirect('/prints/new');
});

/*router.get('/:id', function(req, res, next) {
  res.render('edit-print');
	console.log('print id: ' + req.params.id)
});*/

module.exports = router;