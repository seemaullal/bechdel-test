var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/whostack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error :('));

var User;
var userSchema = new mongoose.Schema({
	// SlackId: String,
	// lastName: {type: String, required: true},
	// // img: { data: Buffer, contentType: String }, //user adds their own image
	// imageUrl: {type: String}, //only required if they are uploading from an outside API
	// gender: String,
	// githubUsername: String
	UserId: String,
	Token: String
});

User =  mongoose.model('User',userSchema);

module.exports = {'User' : User};


