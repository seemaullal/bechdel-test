app.filter('realphoto', function() {
	function getBase64Image(img) {
	    // Create an empty canvas element
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;

	    // Copy the image contents to the canvas
	    var ctx = canvas.getContext("2d");
	    ctx.drawImage(img, 0, 0);

	    // Get the data-URL formatted image
	    // Firefox supports PNG and JPEG. You could check img.src to
	    // guess the original format, but be aware the using "image/jpg"
	    // will re-encode the image.
	    var dataURL = canvas.toDataURL("image/png");

	    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	}

	return function(photo_links) {
		var reals = [];
		photo_links.forEach(function(url) {
			if (url.match(/amazon/g)){
				reals.push(url);
			}
			else {
				gravitarImageUrl = url.substring(0,url.indexOf('?'));
				console.log(gravitarImageUrl);
				//console.log('base64image', getBase64Image(a));
			}
		});
		// for(var i = 0, len = photo_links.length; i < len; i++){
		// 	if (photo_links[i].match(/amazon/g)){
		// 		reals.push(photo_links[i]);
		// 	}
		// }
		// console.log("reals",reals);
		return reals;
	};
});

