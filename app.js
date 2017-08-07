//===Activating express
var express = require('express');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var app = express();

/*==Handling Mongoose Connection==*/
mongoose.connect('mongodb://localhost/libaryApp');
var md = mongoose.connection;

/*==checking for connection==*/
md.once('open', function () {
	console.log(`connected to MongoDB in app.js`);
});

/*checking for mongoose connection errors*/
md.on('error', function (err) {
	console.log(`error from connection to mongoose in app.js : ${err}`);
});

/*==End of Handling Mongoose Connection==*/

var nav = [{
            Link:"/books",
		    Text: "Book"
		},{
			Link: "/Authors",
			Text: 'Author'
		}],

		bookRouter = require("./src/routes/bookRoutes")(nav),
		adminRouter = require("./src/routes/adminRoutes")(nav),
		authRouter = require("./src/routes/authRoutes")(nav),
		userRouter = require("./src/routes/users");

//====Middleware======
app.use("/assets", express.static('assets'));
app.use(express.static("./src/views"));

//====setting the the body parser for the body..
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'libary', resave: true, saveUninitialized: true}));
require("./src/config/passport")(app);

//====rendering the index as a static file===
app.set("views", "./src/views");
//====using ejs as the view engine====
app.set('view engine', 'ejs');

//====routing the books====
app.use('/Books', bookRouter);
app.use('/Admin', adminRouter);
app.use('/Auth', authRouter);

/*==Routing the Users==*/
app.use('/users', userRouter);

/*==end of routing the users==*/

/*==putting the logout option as global==*/
app.get('*', function (req, res, next) {
	res.locals.user = req.user || null;
	next();
});
/*==End of putting the logout option as global==*/

//=====Routing the app====
app.get("/", function(req, res){
	res.render("index", {
			title: 'Books',
			 nav: nav
		});
});

var port = process.env.PORT || 5000;
//===Serving the app a port
app.listen(port, function(err){
	console.log(`s#rv#r 3000 @#$% 5000 on`);
});

