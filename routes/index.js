var express = require('express');
var router = express.Router();
var request = require('request');
// var emitter = require('events').EventEmitter;
var Crawler = require("js-crawler");

// Crawler.setMaxListeners(0);
/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile('./index.html', {root: './'});
});

router.get('/testcrawl', function(req, res) {

	var crawler = new Crawler().configure({
	  	// shouldCrawl: function(url) {
	   //  	// return (url.indexOf("Movie Scripts") < 0 && url.indexOf("genre") < 0 && url.indexOf("alphabetical") < 0);
	  	// },
	  	depth: 3
	});
	var urls = [ ];
	crawler.crawl('http://www.imsdb.com/all%20scripts/' , function onSuccess(page) {
		console.log(page.url);
		urls.push(page.url);
		// res.send(page.url);
	});
	res.send(urls);
});

router.get('/api/getcast/:moviename', function(req,res) {
	var url = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json';
	var qs = {
		apikey : 'tg7n4r3efe9dezvrpk3t6j7m',
		q : req.params.moviename,
		page_limit : 1
	};
	request({url: url, qs: qs }, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			var id = body.movies[0].id;
			castUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies/' + id + '/cast.json?apikey=tg7n4r3efe9dezvrpk3t6j7m';
			request({url: castUrl, qs: qs }, function (err, response, body) {
				body = JSON.parse(body);
				var characters = [ ];
				body.cast.forEach(function (char) {
					characters.push(char.characters[0]);
				});
				res.send(characters);
			});

			// console.log(body);
			// res.send(body);
		}
	});

});

router.get("/api/gender/:name", function(req,res){
	var name = req.params.name;
	request({url:"https://api.genderize.io/?name="+name},function(err, response, data){
		if (err){
			console.log("err",err)
			res.send("err with api")
			return
		}
        data =JSON.parse(data);
        res.send(data);
    	});
});

module.exports = router;

