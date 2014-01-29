var mongoose = require('./db');

var userSchema = new mongoose.Schema({
    email:    String,
    password: String
});

userSchema.methods.checkUserExist = function(cb) {
	this.model('users').findOne({email: this.email}, function(err, user) {
		if (err) throw err;
		cb(err, user);
	});
};

userSchema.methods.auth = function(cb) {
	this.model('users').findOne({email: this.email, password: this.password}, function(err, user) {
		if (err) throw err;
		cb(err, user);
	});
};

module.exports = mongoose.model('users', userSchema);