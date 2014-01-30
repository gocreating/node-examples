
/*
 * Module dependencies.
 */

var express    = require('express'),
	http	   = require('http'),
	path	   = require('path');

var app = express();

// all environments
app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session({
		cookie: {
			expires: new Date(Date.now() + 40*60*1000),
			maxAge: 40*60*1000 // Expires after 40 minutes
		}
	}));
	
	app.use(express.static(path.join(__dirname, 'public')));

	// Authorization
	app.use(function (req, res, next) {
		if (req.session.isAuth == undefined) {
			req.session.isAuth = false;
		}
		res.locals.isAuth = req.session.isAuth;
		next();
	});

	// Messages
	app.use(function (req, res, next) {
		var err  = req.session.err,
			succ = req.session.succ;
		delete req.session.err;
		delete req.session.succ;
		res.locals.msg = '';
		if (err) {
			res.locals.msg = err
		};
		if (succ) {
			res.locals.msg = succ;
		}
		next();
	});

	// Default routing
	app.use(app.router);

	// Dealing with error 404
	app.use(function(req, res, next){
		res.status(404);

		// respond with html page
		if (req.accepts('html')) {
			res.render('err/404', {
				title: 'Page not found'
			});
			return;
		}

		// respond with json
		if (req.accepts('json')) {
			res.send({
				error: 'Page not found'
			});
			return;
		}

		// default to plain-text. send()
		res.type('txt').send('Page not found');
	});
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// Custom routing
require('./routes/general')(app);
require('./routes/user')(app);
require('./routes/article')(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});