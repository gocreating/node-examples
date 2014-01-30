var mongoose = require('./db');

var userSchema = new mongoose.Schema({
	name: 		   String,
	email: 		   String,
	password: 	   String,
	registerTime:  {type: Date,   default: Date.now},
	lastLoginTime: {type: Date,   default: null},
	loginCount:    {type: Number, default: 0}
});

userSchema.methods.checkUserExist = function(cb) {
	this.model('users').findOne({email: this.email}, function(err, user) {
		if (err) throw err;
		cb(err, user);
	});
};

userSchema.methods.auth = function(cb) {
	this.model('users').findOneAndUpdate(
		{email: this.email, password: this.password},
		{lastLoginTime: new Date(), $inc: {loginCount: 1}},
		function(err, user) {
			if (err) throw err;
			cb(err, user);
		}
	);
};

module.exports = mongoose.model('users', userSchema);