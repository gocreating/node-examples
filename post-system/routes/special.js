module.exports = function(app) {
	// Only accessible for the current authorized user
	var selfPaths = [
		'/article/edit/*'
	];

	// Only accessible for an authorized user
	var authPaths = selfPaths.concat([
		'/user/auth/*',
		'/user/logout',
		'/article/post'
	]);

	// Only accessible for an unauthorized user
	var unauthPaths = [
		'/user/login'
	];

	selfPaths.forEach(function(path) {
		app.get(path, function(req, res, next) {
			if (req.session.user._id == req.body.uid) {
				next();
			} else {
				res.render('err/unauthorized', {
					title: 'Unauthorized'
				});
			}
		});
	});

	unauthPaths.forEach(function(path) {
		app.get(path, function(req, res, next) {
			if (req.session.isAuth) {
				res.render('err/authorized', {
					title: 'Authorized'
				});
			} else {
				next();
			}
		});
	});

	authPaths.forEach(function(path) {
		app.get(path, function(req, res, next) {
			if (req.session.isAuth) {
				next();
			} else {
				// Record the previous page
				req.session.previousPage = req.url;
				res.render('err/unauthorized', {
					title: 'Unauthorized'
				});
			}
		}); 
	});
};