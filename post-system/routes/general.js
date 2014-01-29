module.exports = function(app) {
	// Home
	app.get('/', function (req, res) {
		res.render('content/home', {
			title: 'post-system'
		});
	});
};