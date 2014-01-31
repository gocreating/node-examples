var mw 		= require('./middlewares'),
	Article = require('../models/article');

// To prevent blank data or injection
function checkData(req, res, next) {
	var data = req.body;
	for(var key in data) {
		if (data[key] == '') {
			req.session.err = 'Empty ' + key + '.';
			res.redirect(req.route.path);
			return;
		}
	}
	next();
}

// Routing
module.exports = function(app) {
	// Post new article
	app.get('/article/post', mw.auth, function (req, res) {
		res.render('article/auth/post', {
			title: 'Post new article'
		});
	});

	app.post('/article/post', mw.auth, checkData, function (req, res) {
		var article = new Article({
			author: req.session.user._id,
			postTime: new Date(),
			lastEditTime: new Date(),
			title: req.body.title,
			content: req.body.content
		});

		article.save(function (err, newArticle) {
			if (err) throw err;
			res.redirect('/article/' + newArticle._id + '/' + newArticle.author);
		});
	});

	// List all articles
	app.get('/article', function (req, res) {
		Article.find({}, '_id title author')
			   .populate('author', 'name')
			   .exec(
			function (err, readArticles) {
				if (err) throw err;
				res.render('article/list', {
					title: 'Article List',
					articles: readArticles
				});
			}
		);
	});

	// Display some article
	app.get('/article/:id/:authorId', mw.checkSelf, function (req, res) {
		Article.findById(req.params.id)
			   .populate('author', 'email')
			   .exec(function (err, readArticle) {

			if (err) throw err;
			res.render('article/display', {
				title: readArticle.title,
				article: readArticle
			});
		});
	});

	// Edit article
	app.get('/article/edit/:id/:authorId', mw.self, function (req, res) {
		Article.findById(req.params.id)
			   .populate('author', 'email')
			   .exec(function (err, readArticle) {

			if (err) throw err;
			res.render('article/self/edit', {
				title: 'Edit Article',
				article: readArticle
			});
		});
	});

	app.post('/article/edit/:id/:authorId', mw.self, function (req, res) {
		var updateArticle = {
			lastEditTime: new Date(),
			title: req.body.title,
			content: req.body.content
		};

		Article.findByIdAndUpdate(req.params.id, updateArticle, function (err, readArticle) {
			if (err) throw err;
			res.redirect('/article/' + req.params.id + '/' + req.params.authorId);
		});
	});

	// Delete article
	app.get('/article/delete/:id/:authorId', mw.self, function (req, res) {
		Article.findByIdAndRemove(req.params.id, function (err, deleteArticle) {
			if (err) throw err;
			res.redirect('/article');
		});
	});
};