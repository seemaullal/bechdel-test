var express = require('express');
var router = express.Router();
var request = require('request');


/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile('./index.html', {root: './'});
});


module.exports = router;


