module.exports = function(app) {
	// Home
	app.get('/', function (req, res) {
		res.render('general/home', {
			title: 'post-system'
		});
	});
};