var mongoose = require('./db');

var commentSchema = new mongoose.Schema({
	author: 	{type: mongoose.Schema.ObjectId, ref: 'users'},
	createTime: {type: Date, default: Date.now},
	content: 	String,
	ip: 		String,
	replies: 	[{type: mongoose.Schema.ObjectId, ref: 'comments', default: null}]
});

module.exports = mongoose.model('comments', commentSchema);