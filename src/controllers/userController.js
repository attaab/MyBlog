var mongodb = require('mongodb').MongoClient,
	objectID = require('mongodb').objectID,
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	
	
	nav = [
		{
			Text: 'Books',
			Link: '/books'
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


var controller = function () {
	/*==declaring variables for usercontroller==*/
	var middleware, getProfile, getIndex, editItem, deleteItem, addItem;
	/*==End of declaring variables for usercontroller==*/
	
	/*==creating middleware for login authentication==*/
	middleware = function (req, res, next) {
			if (!req.user) {
				res.redirect('/auth/register');
			}
			next();
		};
	/*==End of creating middleware for login authentication==*/
	
	/*==add article to routes==*/
	addItem = function (req, res) {
		var article = new Article();
		article.title = req.body.title;
		article.author = req.user._id;
		article.body = req.body.body;
		
		article.save(function (err) {
			if (err) {
				console.log(`error from article.save(): ${err}`);
				req.flash('danger', 'Article was not saved successfully');
				return;
			} else {
				req.flash('success', 'Article added');
				res.redirect('/users/profile');
			};
		});
	};
	/*==end of add article to route==*/

	/*==Creating route to profile==*/
	getProfile = function (req, res) {
			Article.find({}, function (err, articles) {
				if (err) {
					console.log(`error  from Articles.find() ${err}`)
				} else {
					
				res.render('profile',
						   {
					nav: nav,
					articles: articles,
					user: req.user
				});
				}
			})
		};
	/*==End of creating route to profile==*/
	
	/*==Function for logging out==*/
	logout = function (req, res) {
		req.logout();
		res.redirect('/');
	};
	/*==End of Function for logging out==*/
	
	/*==Creating route for a single item==*/
	getIndex = function (req, res) {
		Article.findById(req.params.id, function (err, article) {
			res.send(article);
		});
	};
	/*==End of Creating route for a single item==*/
	
	/*==Controller for editing content==*/
	editItem = function (req, res) {
		var article = {};
		article.title = req.body.title;
		article.author = req.body.author;
		article.body = req.body.body;
		
		/*==Creating a query to ensure that the id matches==*/
		var query = {_id: req.params.id};
		
		Article.update(query, article, function (err) {
			if (err) {
				console.log(`error from article.save(): ${err}`);
				return;
			} else {
				req.flash('success', 'Article updated');
				res.redirect('/users/profile');
			};
		});
	}; 
	/*==End of controller for editing content==*/
	
	/*==Creating the controller for delete request==*/
	deleteItem = function (req, res) {
		var query = {_id: req.params.id};
		
		Article.remove(query, function (err){
			if (err) {
				console.log(`error form delete Request: ${err}`);
			};
			req.flash('warning', 'Article deleted');
			res.send('success');
		});
	};
	/*==End of Creating the controller for delete request==*/
	
	
	return {
		middleware: middleware,
		getProfile: getProfile,
		getIndex: getIndex,
		editItem: editItem,
		deleteItem: deleteItem,
		addItem: addItem,
		logout: logout
	};
};

module.exports = controller;