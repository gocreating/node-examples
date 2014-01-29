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

// exports.self = function (req, res, next) {
// 	if (req.session.isAuth && req.session.user._id == req.body.uid) {
// 		next();
// 	} else {
// 		// Record the previous page
// 		req.session.previousPage = req.url;
// 		res.render('err/unauthorized', {
// 			title: 'Unauthorized'
// 		});
// 	}
// }

exports.self = function (req, res, next) {
	if (req.session.isAuth && req.session.user._id == req.params.authorId) {
		res.locals.isSelf = true;
		next();
	} else {
		// Record the previous page
		req.session.previousPage = req.url;
		res.render('err/unauthorized', {
			title: 'Unauthorized'
		});
	}
}

exports.checkSelf = function (req, res, next) {
	res.locals.isSelf = false;
	if (req.session.isAuth) {
		if (req.session.user._id == req.params.authorId) {
			res.locals.isSelf = true;
		}
	}
	next();
}

exports.isSelf = function (req, uid) {
	if (req.session.isAuth) {
		if (req.session.user._id == uid) {
			return true;
		}
	}
	return false;
}