// Load plugins
var gulp = require('gulp'),
		gutil = require('gulp-util'),
   	compass = require('gulp-compass'),
		livereload = require('gulp-livereload'),
		concat = require('gulp-concat');

//Styles with compass
gulp.task('compass', function() {
  gulp.src('./src/stylesheets/**/*.scss')
  .pipe(compass({
    config_file: './config.rb',
    css: 'public/stylesheets',
    sass: 'src/stylesheets'
  }))
	.pipe(livereload());
});

gulp.task('scripts', function() {
	
	var _scripts = [
		'src/javascripts/gillray.js',
		'src/javascripts/providers/*.js',
		'src/javascripts/directives/*.js',
		'src/javascripts/controllers/*.js'
	];
	
	return gulp.src(_scripts)
		.pipe(concat('main.js'))
		.pipe(gulp.dest('public/javascripts'))
		.pipe(livereload());
});
 
// Watch
gulp.task('watch', function() {
 
  // Watch .scss files
  gulp.watch('src/**/*.scss', ['compass']);
 
  // Watch .scss files
  gulp.watch('src/javascripts/**/*.js', ['scripts']);
 
  // Create LiveReload server
  livereload.listen();
 
  // Watch any files in dist/, reload on change
  //gulp.watch(['assets/**/*.*']).on('change', livereload.changed);
});