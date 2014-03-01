var mw   = require('./middlewares'),
	User = require('../models/user');

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
			function (err, userList) {
				if (err) throw err;
				res.render('admin/user', {
					layout: 'layout/admin',
					title: 'user',
					users: userList
				});
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