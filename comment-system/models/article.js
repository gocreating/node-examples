var mongoose = require('./db');

var articleSchema = new mongoose.Schema({
	author: 	  {type: mongoose.Schema.ObjectId, ref: 'users'},
	createTime:	  Date,
	lastEditTime: Date,
	title: 		  String,
	content: 	  String,
	comments: 	  [{type: mongoose.Schema.ObjectId, ref: 'comments', default: null}]
});

module.exports = mongoose.model('articles', articleSchema);