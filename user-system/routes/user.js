var User = require('../models/user');

// To prevent blank data or injection
function isDataError(req, email, password) {
	if (email == '') {
		req.session.err = 'Empty email';
		return true;
	}

	if (password == '') {
		req.session.err = 'Empty password.';
		return true;
	}

	if (email.length > 35) {
		req.session.err = 'Email can\'t be more than 35 characters.';
		return true;
	}

	if (password.length > 35) {
		req.session.err = 'Password can\'t be more than 35 characters.';
		return true;
	}

	return false;
}

// Routing
module.exports = function(app) {
	// Prevent an authorized user from logging in again
	app.get('/user/login', function(req, res, next) {
		if (req.session.isAuth) {
			res.render('err/authorized', {
				title: 'Authorized'
			});
		} else {
			next();
		}
	});

	// Prevent an unauthorized user from logging out
	app.get('/user/logout', function(req, res, next) {
		if (req.session.isAuth) {
			next();
		} else {
			res.render('err/unauthorized', {
				title: 'Unauthorized'
			});
		}
	});

	// Authorized page
	app.get('/user/auth/*', function(req, res, next) {
		if (req.session.isAuth) {
			next();
		} else {
			res.render('err/unauthorized', {
				title: 'Unauthorized'
			});
		}
	});

	// Register
	app.get('/user/register', function(req, res) {
		res.render('user/register', {
			title: 'Register'
		});
	});

	app.post('/user/register', function(req, res) {
		var email    = req.body.email;
		var password = req.body.password;

		if (isDataError(req, email, password)) {
			res.redirect('/user/register');
		} else {
			var user = new User({
				email: email,
				password: password
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
		}
	});

	// Login
	app.get('/user/login', function(req, res) {
		res.render('user/login', {
			title: 'Login'
		});
	});

	app.post('/user/login', function(req, res) {
		var email    = req.body.email;
		var password = req.body.password;

		if (isDataError(req, email, password)) {
			res.redirect('/user/register');
		} else {
			var user = new User({
				email: email,
				password: password
			});

			user.auth(function (err, user) {
				if (err) throw err;
				if (user) {
					req.session.isAuth = true;
					req.session.user = user;
					res.redirect('/');
				} else {
					req.session.err = 'Wrong email or password.';
					res.redirect('/user/login');
				}
			});
		}
	});

	// Logout
	app.get('/user/logout', function(req, res) {
		req.session.isAuth = false;
		delete req.session.user;
		req.session.succ = 'Logout successfully.';
		res.redirect('/');
	});

	// Auth pages
	app.get('/user/auth/info', function(req, res) {
		res.render('user/auth/info', {
			title: 'User Information',
			user: req.session.user
		});
	});

	
};