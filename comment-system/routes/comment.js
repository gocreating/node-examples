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
	// Read comments of some article
	app.get('/article/comment/:articleId', mw.auth, function (req, res) {
		// Comment.findById(req.params.articleId)
		// 	   .populate('replies')
		// 	   .exec(
		// 	function (err, readComment) {
		// 		if (err) throw err;
		// 		console.log(readComment);
		// 	}
		// );
	});

	// Add comment
	app.post('/article/comment/:articleId', mw.auth, function (req, res) {
		var newComment = new Comment({
			author: req.session.user._id,
			content: req.body.content
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

	// Add replies to some comment
	app.post('/comment/reply/:id', mw.auth, function (req, res) {
		var newComment = new Comment({
			author: req.session.user._id,
			content: req.body.content
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