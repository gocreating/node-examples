var Comment = require('../models/comment');

/********************
 * Auth middlewares *
 ********************/

// Accessible for an authorized user
exports.auth = function (req, res, next) {
	if (req.session.isAuth) {
		// Clear previous page record
		delete req.session.previousPage;
		next();
	} else {
		// Record the previous page
		req.session.previousPage = req.url;
		res.render('err/401', {
			title: 'Unauthorized'
		});
	}
};

// Accessible for an unauthorized user
exports.unauth = function (req, res, next) {
	if (req.session.isAuth) {
		res.render('err/authorized', {
			title: 'Authorized'
		});
	} else {
		next();
	}
}

// Accessible for author
exports.self = function (req, res, next) {
	// Check authorized
	if (req.session.isAuth) {
		// Check author
		if (req.session.user._id == req.params.authorId) {
			// Clear previous page record
			delete req.session.previousPage;
			res.locals.isSelf = true;
			next();
		} else {
			res.render('err/403', {
				title: 'Forbidden'
			});
		}
	} else {
		res.render('err/401', {
			title: 'Unauthorized'
		});
	}
	// Record the previous page
	req.session.previousPage = req.url;
}

// Set 'isSelf' parameter
exports.checkSelf = function (req, res, next) {
	res.locals.isSelf = false;
	if (req.session.isAuth) {
		if (req.session.user._id == req.params.authorId) {
			res.locals.isSelf = true;
		}
	}
	next();
}

/*******************
 * Extend function *
 *******************/

// Check whether the parameter 'uid' is the same as the authorized user
exports.isSelf = function (req, uid) {
	if (req.session.isAuth) {
		if (req.session.user._id == uid) {
			return true;
		}
	}
	return false;
}

// Recursively remove comments
exports.removeComments = function removeComments (arrComments) {
	Comment
	.find({_id: {$in: arrComments}})
	.populate('replies')
	.exec(function (err, readReplies) {
		if (err) throw err;
		for (var i in readReplies) {
			var comment = readReplies[i];
			console.log(comment.content);
			comment.remove();
			removeComments(comment.replies);
		}
	});
};