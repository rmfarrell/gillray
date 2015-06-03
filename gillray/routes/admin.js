var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	
  res.redirect('/admin/new')
});

//Edit a new print
router.get('/new', function(req, res, next) {

	res.render('edit-print', { title: 'New Print' });
});

//Redirect to /new if trying to access the /edit route with no parameters
router.get('/edit', function(req, res, next) {
	
	res.redirect('/admin/new');
})

//Edit an existing print
router.get('/edit/:id', function(req, res, next) {
	
	res.render('edit-print', { 
		title: "print-" + req.params["id"]
	});
});

router.get('/dictionary', function(req, res, next) {
	
	res.render('admin-data', {});
});

module.exports = router;