var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var browserSync = require('browser-sync');

gulp.task('styles',function() {
	return gulp.src('./styl/**/*.styl')
		.pipe(stylus())
		.pipe(autoprefixer())
		.pipe(gulp.dest('./css/no-minify/'))
		.pipe(minifyCss())
		.pipe(gulp.dest('./css/'))
		.pipe(browserSync.reload({stream:true}))
});


gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: './',
		},
		open: false,
		ghostMode: false
	});
});

gulp.task('default', ['styles', 'browser-sync'], function(){
	gulp.watch("./**/*.styl", ['styles']);
	gulp.watch("*.html").on('change', browserSync.reload);
});
