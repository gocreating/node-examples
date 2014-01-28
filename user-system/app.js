
/*
 * Module dependencies.
 */

var express		= require('express'),
	http 		= require('http'),
	path		= require('path'),
	routesBasic = require('./routes/basic'),
	routesUser  = require('./routes/user');

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
	app.use(express.session());
	
	app.use(express.static(path.join(__dirname, 'public')));

	// Authorization
	app.use(function (req, res, next) {
		if (req.session.isAuth == undefined) {
			req.session.isAuth = false;
		}
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

	app.use(app.router);
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routesBasic(app);
routesUser(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});