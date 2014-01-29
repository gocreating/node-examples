var mw   = require('./middlewares'),
	User = require('../models/user');

// To prevent blank data or injection
function checkData(req, res, next) {
	if (req.body.email == '') {
		req.session.err = 'Empty email';
		res.redirect(req.route.path);
		return;
	}

	if (req.body.password == '') {
		req.session.err = 'Empty password.';
		res.redirect(req.route.path);
		return;
	}

	if (req.body.email.length > 35) {
		req.session.err = 'Email can\'t be more than 35 characters.';
		res.redirect(req.route.path);
		return;
	}

	if (req.body.password.length > 35) {
		req.session.err = 'Password can\'t be more than 35 characters.';
		res.redirect(req.route.path);
		return;
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
		var email    = req.body.email;
		var password = req.body.password;

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
	});

	// Login
	app.get('/user/login', mw.unauth, function(req, res) {
		res.render('user/login', {
			title: 'Login'
		});
	});

	app.post('/user/login', mw.unauth, checkData, function(req, res) {
		var email    = req.body.email;
		var password = req.body.password;

		var user = new User({
			email: email,
			password: password
		});

		user.auth(function (err, user) {
			if (err) throw err;
			if (user) {
				req.session.isAuth = true;
				req.session.user = user;
				if (req.session.previousPage != undefined) {
					// Redirect to the previous page prior to login page
					// It is recorded in mw.unauth
					res.redirect(req.session.previousPage);
					delete req.session.previousPage;
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

	// Auth pages
	app.get('/user/auth/info', mw.auth, function(req, res) {
		res.render('user/auth/info', {
			title: 'User Information',
			user: req.session.user
		});
	});
};