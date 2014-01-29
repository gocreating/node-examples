var mongoose = require('./db');

var articleSchema = new mongoose.Schema({
	author: 	  {type: mongoose.Schema.ObjectId, ref:'users'},
	postTime: 	  Date,
	lastEditTime: Date,
	title: 		  String,
	content: 	  String
});

module.exports = mongoose.model('articles', articleSchema);