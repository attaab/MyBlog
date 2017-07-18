var mongodb = require('mongodb').MongoClient,
	objectID = require('mongodb').objectID,
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	
	
	nav = [
		{
			Text: 'Books',
			Link: "/books"
		},
		{
			Text: 'Authors',
			Link: '/authors'
		}
	];

mongoose.connect('mongodb://localhost/libaryApp');
var md = mongoose.connection;

/*==checking for mongoose connection==*/
md.once('open', function () {
	'use strict';
	console.log('connected to MongoDB in usersController.js');
});

/*checking for mongoose connection errors*/
md.on('error', function (err) {
	'use strict';
	console.log(`error from connection to mongoose in usersController.js : ${err}`);
});

/*==Bringing in Mongoose Model===*/
var Article = require('../models/article');
/*==End of bringing in Mongoose Model==*/


controller = function () {
	/*==creating middleware for login authentication==*/
		middleware = function (req, res, next) {
			if (!req.user) {
				res.redirect('/auth/register');
			}
		};
	/*==End of creating middleware for login authentication==*/
};

module.exports = controller;