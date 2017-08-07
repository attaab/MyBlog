/*jslint node: true*/
var express = require('express'),
    userRoute = express.Router(),
    mongodb = require('mongodb').MongoClient,
	objectID = require('mongodb').objectID,
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	expressValidator  = require('express-validator'),
	flash = require('connect-flash'),
	session = require('express-session'),
 	
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


/*==Express Session Middleware==*/
userRoute.use(session({
  secret: 'users',
  resave: true,
  saveUninitialized: true
}));
/*==End of express session middleware==*/

/*==Express Message middleware==*/
userRoute.use(require('connect-flash')());
userRoute.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
/*==End of express Message middleware==*/

/*==Express validator middleware==*/
userRoute.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
/*==End of express valiator middleware==*/


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

/*==Bringing in Mongoose Model for article===*/
var Article = require('../models/article');
/*==End of bringing in Mongoose Model for article==*/

/*==Bringing in mongoose model for users==*/
var Users = require('../models/usersSchema');
/*==End of Bringing in mongoose model for users==*/

module.exports = (function () {
	'use strict';
	
	/*==Pulling in the user Controller==*/
	var userController = require('../controllers/userController')();
	/*==End of pulling in the user controller==*/
	
	/*==adding middleware to route==*/
	userRoute.use(userController.middleware);
	/*==end of adding middleware to route==*/
	
	/*==Route to go to the profile==*/
	userRoute.route('/profile')
		.get(userController.getProfile);
	/*==End of Route to go to the profile==*/
	
	/*==Logout route==*/
	userRoute.route('/logout')
		.get(userController.logout);
	/*==End of Logout route==*/
	
	/*==Add articles route==*/
	userRoute.route("/addArticle")
		.post(userController.addItem);
	/*==End of Add articles route==*/
	
	/*==Route to get Single article==*/
	userRoute.route('/:id')
		.get(userController.getIndex);
	/*==End of Route to get Single article==*/
	
	/*==Route to Edit Single article==*/
	userRoute.route("/editArticle/:id")
		.post(userController.editItem);
	/*==End of route to Edit single article==*/
	
	/*==request to delete post==*/
	userRoute.route('/deleteArticle/:id')
		.delete(userController.deleteItem);
	/*==End of request to delete post==*/
	
	return userRoute;
}());