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


// router.get('/testcrawl', function(req, res) {
// 	var startUrl = 'http://www.imsdb.com/all%20scripts/';

// 	// URL variables
// 	var visitedUrls = [], pendingUrls = [];

// 	// Create instances
// 	var casper = require('casper').create({ /*verbose: true, logLevel: 'debug'*/ });
// 	var utils = require('utils')
// 	var helpers = require('./helpers')

// 	// Spider from the given URL
// 	function spider(url) {

// 		// Add the URL to the visited stack
// 		visitedUrls.push(url);

// 		// Open the URL
// 		casper.open(url).then(function() {

// 			// Set the status style based on server status code
// 			var status = this.status().currentHTTPStatus;
// 			switch(status) {
// 				case 200: var statusStyle = { fg: 'green', bold: true }; break;
// 				case 404: var statusStyle = { fg: 'red', bold: true }; break;
// 				 default: var statusStyle = { fg: 'magenta', bold: true }; break;
// 			}

// 			// Display the spidered URL and status
// 			this.echo(this.colorizer.format(status, statusStyle) + ' ' + url);

// 			// Find links present on this page
// 			var links = this.evaluate(function() {
// 				var links = [];
// 				Array.prototype.forEach.call(__utils__.findAll('a'), function(e) {
// 					links.push(e.getAttribute('href'));
// 				});
// 				return links;
// 			});

// 			// Add newly found URLs to the stack
// 			var baseUrl = this.getGlobal('location').origin;
// 			Array.prototype.forEach.call(links, function(link) {
// 				var newUrl = helpers.absoluteUri(baseUrl, link);
// 				if (pendingUrls.indexOf(newUrl) == -1 && visitedUrls.indexOf(newUrl) == -1) {
// 					//casper.echo(casper.colorizer.format('-> Pushed ' + newUrl + ' onto the stack', { fg: 'magenta' }));
// 					pendingUrls.push(newUrl);
// 				}
// 			});

// 			// If there are URLs to be processed
// 			if (pendingUrls.length > 0) {
// 				var nextUrl = pendingUrls.shift();
// 				//this.echo(this.colorizer.format('<- Popped ' + nextUrl + ' from the stack', { fg: 'blue' }));
// 				spider(nextUrl);
// 			}

// 		});

// 	}

// 	// Start spidering
// 	casper.start(startUrl, function() {
// 		spider(startUrl);
// 	});

// 	// Start the run
// 	casper.run();

// 	console.log(visitedUrls);
// 	res.send(visitedUrls);

// });
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


module.exports = router;

