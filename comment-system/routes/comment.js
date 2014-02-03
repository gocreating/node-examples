var mw 		= require('./middlewares'),
	Comment = require('../models/comment');

// To prevent blank data or injection
function checkData(req, res, next) {
	var data = req.body;
	for(var key in data) {
		if (data[key] == '') {
			req.session.err = 'Empty ' + key + '.';
			res.redirect(req.url);
			return;
		}
	}
	next();
}

// Routing
module.exports = function(app) {
	// Read comments (json)
	// type parameter could be 'article', 'vote', ...etc.
	// Reference of deep populate:
	// https://groups.google.com/forum/#!topic/mongoose-orm/yuKEqiu4JHI
	app.get('/comment/:type/:_id', function (req, res) {
		var Collection = require('../models/' + req.params.type);
		Collection
		.findById(req.params._id)
		.populate('comments')
		.exec(
			function (err, doc) {
				if (err) throw err;
				var User = require('../models/user');
				User.populate(
					doc,
					{path:'comments.author', select: 'name'},
					function (err, readObject) {
						if (err) throw err;
						res.send(readObject.comments);
					}
				);
			}
		);
	});

	// Add a comment
	app.post('/article/comment/:articleId', mw.auth, function (req, res) {
		var newComment = new Comment({
			author: req.session.user._id,
			content: req.body.content,
			ip: req.connection.remoteAddress
		});

		var Article = require('../models/article');
		Article
		.findByIdAndUpdate(
			req.params.articleId,
			{$push: {comments: newComment}}
		)
		.populate('comments')
		.exec(
			function (err, readArticle) {
				if (err) throw err;
				newComment.save();
				res.redirect('/article/' + req.params.articleId + '/' + readArticle.author);
			}
		);
	});

	// Read replies of some comment (json)
	app.get('/comment/reply/:id', function (req, res) {
		Comment
		.findById(req.params.id, 'replies')
		.populate('replies')
		.exec(
			function (err, doc) {
				if (err) throw err;
				var User = require('../models/user');
				User.populate(
					doc,
					{path: 'replies.author', select: 'name'},
					function (err, readComment) {
						if (err) throw err;
						res.send(readComment.replies);
					}
				);
			}
		);
	});

	// Add replies to some comment
	app.post('/comment/reply/:id', mw.auth, function (req, res) {
		var newComment = new Comment({
			author: req.session.user._id,
			content: req.body.content,
			ip: req.connection.remoteAddress
		});

		Comment
		.findByIdAndUpdate(
			req.params.id,
			{$push: {replies: newComment}}
		)
		.populate('replies')
		.exec(
			function (err, addedComment) {
				if (err) throw err;
				newComment.save()
				res.redirect('/article/' + req.body.articleId + '/' + req.session.user._id);
			}
		);
	});
};