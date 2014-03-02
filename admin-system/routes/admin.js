var mw 		= require('./middlewares'),
	User 	= require('../models/user'),
	Article = require('../models/article');

module.exports = function(app) {
	// Home
	app.get('/admin', function (req, res) {
		res.render('admin/home', {
			layout: 'layout/admin',
			title: 'home'
		});
	});

	// User management
	app.get('/admin/user', function (req, res) {
		User
		.find(
			{},
			'name email registerTime lastLoginTime loginCount',
			function (err, readUsers) {
				if (err) throw err;
				res.render('admin/user/list', {
					layout: 'layout/admin',
					title: 'user list',
					users: readUsers
				});
			}
		);
	});

	app.get('/admin/user/:userId', function (req, res) {
		User
		.findById(
			req.params.userId,
			'name email registerTime lastLoginTime loginCount',
			function (err, readUser) {
				if (err) throw err;

				Article
				.find(
					{author: req.params.userId},
					function (err, readArticles) {
						if (err) throw err;
						console.log(readUser);
						res.render('admin/user/detail', {
							layout: 'layout/admin',
							title: 'user detail',
							user: readUser,
							articles: readArticles
						});
					}
				);
			}
		);
	});

	// Mail system
	app.get('/admin/mail', function (req, res) {
		res.render('admin/mail', {
			layout: 'layout/admin',
			title: 'mail'
		});
	});

	// Configuration
	app.get('/admin/config', function (req, res) {
		res.render('admin/config', {
			layout: 'layout/admin',
			title: 'configuration'
		});
	});

	// Test
	app.get('/admin/test', function (req, res) {
		req.session.alert = {type: 'info', title: 'Title', content: 'content'};
		res.redirect('/admin/user');
	});
};