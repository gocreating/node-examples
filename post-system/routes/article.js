var Article = require('../models/article');

// To prevent blank data or injection
function checkData(req, res, next) {
	// if (req.body.email == '') {
	// 	req.session.err = 'Empty email';
	// 	res.redirect(req.route.path);
	// 	return;
	// }

	// if (req.body.email.length > 35) {
	// 	req.session.err = 'Email can\'t be more than 35 characters.';
	// 	res.redirect(req.route.path);
	// 	return;
	// }

	next();
}

// Routing
module.exports = function(app) {
	// Post new article
	app.get('/article/post', function(req, res) {
		res.render('article/auth/post', {
			title: 'Post new article'
		});
	});

	app.post('/article/post', checkData, function(req, res) {
		var article = new Article({
			author: req.session.user._id,
			postTime: new Date(),
			lastEditTime: new Date(),
			title: req.body.title,
			content: req.body.content
		});

		article.save(function (err, newArticle) {
			if (err) throw err;
			res.redirect('/article/' + newArticle._id);
		});
	});

	// List all articles
	app.get('/article/all', function(req, res) {
		Article.find({}, 'title _id', function (err, readArticles) {
			res.render('article/list', {
				title: 'Article List',
				articles: readArticles
			});
		});
	});

	// Display some article
	app.get('/article/:id', function(req, res) {
		Article.findById(req.params.id, function (err, readArticle) {
			if (err) throw err;
			var User = require('../models/user');
			User.findById(readArticle.author, function (err, readUser) {
				if (err) throw err;
				res.render('article/display', {
					title: readArticle.title,
					article: readArticle,
					author: readUser
				});
			});
		});
	});
};