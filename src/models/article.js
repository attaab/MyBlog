/*jslint node: true*/
var mongoose = require('mongoose');

/*==adding schema ==*/

var articleSchema = mongoose.Schema(
		{
			title: {
				type: String,
				required: true
			},
			author: {
				type: String,
				required: true
			},
			body: {
				type: String,
				required: true
			}
		}
	);

var articles = module.exports = mongoose.model('Article', articleSchema);