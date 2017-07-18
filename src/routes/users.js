/*jslint node: true*/
var express = require('express'),
    userRoute = express.Router(),
    mongodb = require('mongodb').MongoClient,
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
	console.log('connected to MongoDB in users.js');
});

/*checking for mongoose connection errors*/
md.on('error', function (err) {
	'use strict';
	console.log(`error from connection to mongoose in users.js : ${err}`);
});

/*==Bringing in Mongoose Model===*/
var Article = require('../models/article');
/*==End of bringing in Mongoose Model==*/

module.exports = (function () {
	'use strict';
	/*==Pulling in the user Controller==*/
	var userController = require('../controllers/userController')();
	/*==End of pulling in the user controller==*/
	
	/*==Route to go to the profile==*/
	userRoute.use(function (req, res, next) {
		if (!req.user) {
			res.redirect('/auth/register');
		}
		next();
	});
	userRoute.route('/profile')
		.get(function (req, res) {
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
		});
	/*==End of Route to go to the profile==*/
	
	/*==Add articles route==*/
	userRoute.route("/addArticle")
		.post(function (req, res) {
		var article = new Article();
		article.title = req.body.title;
		article.author = req.body.author;
		article.body = req.body.body;
		
		article.save(function (err) {
			if (err) {
				console.log(`error from article.save(): ${err}`);
				return;
			} else {
				res.redirect('/users/profile');
			};
		});
	});
	/*==End of Add articles route==*/
	
	/*==Route to get Single article==*/
	userRoute.route('/:id')
		.get(function (req, res) {
		Article.findById(req.params.id, function (err, article) {
			res.send(article);
		});
	});
	/*==End of Route to get Single article==*/
	
	/*==Route to Edit Single article==*/
	userRoute.route("/editArticle/:id")
		.post(function (req, res) {
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
				res.redirect('/users/profile');
			};
		});
	});
	/*==End of route to Edit single article==*/
	
	/*==request to delete post==*/
	userRoute.route('/deleteArticle/:id')
		.delete(function (req, res) {
		var query = {_id: req.params.id};
		
		Article.remove(query, function (err){
			if (err) {
				console.log(`error form delete Request: ${err}`);
			};
			res.send('success');
		});
	});
	/*==End of request to delete post==*/
	
	return userRoute;
}());