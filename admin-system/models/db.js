var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myapp');
module.exports = mongoose;