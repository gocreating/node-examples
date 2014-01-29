var mongoose = require('./db');

var articleSchema = new mongoose.Schema({
	author: 	  mongoose.Schema.ObjectId,
	postTime: 	  Date,
	lastEditTime: Date,
	title: 		  String,
	content: 	  String
});

module.exports = mongoose.model('articles', articleSchema);