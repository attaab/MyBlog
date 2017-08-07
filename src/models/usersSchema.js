/*jslint node: true*/

/*==Setting the schema for our users==*/
var mongoose = require('mongoose'),
	UserSchema = mongoose.Schema({
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	});

var articles = module.exports = mongoose.model('User', UserSchema);
/*==End of Setting the schema for our users==*/