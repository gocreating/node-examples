exports.auth = function (req, res, next) {
	if (req.session.isAuth) {
		next();
	} else {
		// Record the previous page
		req.session.previousPage = req.url;
		res.render('err/unauthorized', {
			title: 'Unauthorized'
		});
	}
};

exports.unauth = function (req, res, next) {
	if (req.session.isAuth) {
		res.render('err/authorized', {
			title: 'Authorized'
		});
	} else {
		next();
	}
}

exports.self = function (req, res, next) {
	if (req.session.user._id == req.body.uid) {
		next();
	} else {
		res.render('err/unauthorized', {
			title: 'Unauthorized'
		});
	}
}