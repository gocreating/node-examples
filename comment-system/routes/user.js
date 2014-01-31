var mw   = require('./middlewares'),
	User = require('../models/user');

// To prevent blank data or injection
function checkData(req, res, next) {
	var data = req.body;
	for(var key in data) {
		if (data[key] == '') {
			req.session.err = 'Empty ' + key + '.';
			if (req.route.path == '/user/password/edit/:authorId') {
				res.redirect('/user/edit/' + req.params.authorId);
			} else {
				res.redirect(req.url);
			}
			return;
		}
	}
	next();
}

// Routing
module.exports = function(app) {
	// Register
	app.get('/user/register', function(req, res) {
		res.render('user/register', {
			title: 'Register'
		});
	});

	app.post('/user/register', checkData, function(req, res) {
		var user = new User({
			name: 		   req.body.name,
			email: 		   req.body.email,
			password: 	   req.body.password
		});

		// Check whether the email exists
		user.checkUserExist(function (err, isExist) {
			if (isExist) {
				req.session.err = 'This email has been used.';
				res.redirect('/user/register');
			} else {
				user.save(function (err, newUser) {
					if (err) throw err;
					req.session.succ = 'Register successfully';
					res.redirect('/user/register');
				});
			}
		});
	});

	// Login
	app.get('/user/login', mw.unauth, function(req, res) {
		res.render('user/login', {
			title: 'Login'
		});
	});

	app.post('/user/login', mw.unauth, checkData, function(req, res) {
		var user = new User({
			email: 		   req.body.email,
			password: 	   req.body.password
		});

		user.auth(function (err, user) {
			if (err) throw err;
			if (user) {
				req.session.isAuth = true;
				req.session.user = user;
				if (req.session.previousPage != undefined) {
					// Redirect to the previous page prior to login page
					// It is recorded in middlewares.js
					res.redirect(req.session.previousPage);
				} else {
					res.redirect('/');
				}
			} else {
				req.session.err = 'Wrong email or password.';
				res.redirect('/user/login');
			}
		});
	});

	// Logout
	app.get('/user/logout', mw.auth, function(req, res) {
		req.session.isAuth = false;
		delete req.session.user;
		req.session.succ = 'Logout successfully.';
		res.redirect('/');
	});

	// Edit
	app.get('/user/edit/:authorId', mw.self, function(req, res) {
		req.session.previousPage = req.url;
		console.log('===================');
		console.log(req.session.previousPage);
		console.log('===================');

		User.findById(req.params.authorId, 'name email', function (err, readUser) {
			if (err) throw err;
				res.render('user/self/edit', {
				title: 'Edit User Information',
				user: readUser
			});
		});
	});

	app.post('/user/edit/:authorId', mw.self, checkData, function(req, res) {
		User.findByIdAndUpdate(
			req.params.authorId,
			{name: req.body.name},
			function (err, readUser) {
				if (err) throw err;
				req.session.user.name = req.body.name;
				res.redirect('/user/me');
			}
		);
	});

	app.post('/user/password/edit/:authorId', mw.self, checkData, function(req, res) {
		User.findOneAndUpdate(
			{_id: req.params.authorId, password: req.body.old_password},
			{password: req.body.new_password},
			function (err, readUser) {
				if (err) throw err;
				if (readUser) {
					req.session.succ = 'Your password is updated.';
					res.redirect('/user/me');
				} else {
					req.session.err = 'Wrong old password.';
					res.redirect('/user/edit/' + req.params.authorId);
				}
			}
		);
	});

	// Information
	app.get('/user/me', mw.auth, function(req, res) {
		res.render('user/auth/info', {
			title: 'User Information',
			user: req.session.user
		});
	});
};