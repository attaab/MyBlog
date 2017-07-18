/*jslint node: true*/
/*jshint esversion: 6*/
var gulp = require('gulp'),
	nodemon =  require('gulp-nodemon'),
	jsFiles = ['*.js', 'src/**/*.js', 'assets/**/*.js'];

gulp.task('inject', function () {
	'use strict';
	var wiredep = require('wiredep').stream,
		inject = require('gulp-inject'),
		options = {
			bowerJson: require('./bower.json'),
			directory: './assets/lib'
		
		},
		injectSrc = gulp.src(['./assets/css/*.css',
							 './assets/js/*.js'], {read: false}),
		injectOptions = {
			ignorePath: '../.'
		};

	return gulp.src('./src/views/*.ejs')
		.pipe(wiredep(options))
		.pipe(inject(injectSrc, injectOptions))
		.pipe(gulp.dest('./src/views'));
});

gulp.task('push', function () {
	'use strict';
	var path = ['./src/views/bookView.ejs', './src/views/profile.ejs'],
		wiredep = require('wiredep').stream,
		inject = require('gulp-inject'),
		options = {
			bowerJson: require('./bower.json'),
			directory: './assets/lib'
		},
		injectSrc = gulp.src(['./assets/css/singleView.css', './assets/css/font-awesome.css',
							 './assets/js/*.js', './src/controllers/deleteRequest.js'], {read: false}),
		injectOptions = {
			ignorePath: '../.'
		};
	return gulp.src(path)
		.pipe(wiredep(options))
		.pipe(inject(injectSrc, injectOptions))
		.pipe(gulp.dest('./src/views'));
});

gulp.task('serve', ['inject', 'push'], function () {
	'use strict';
	var options = {
		delayTime: 1,
		env: {
			'PORT': 3000
		},
		watch: jsFiles
	};

	return nodemon(options)
		.on('restart', function () {
			console.log('Restarting gulp S3rv3r' + options.env.PORT);
		});
});