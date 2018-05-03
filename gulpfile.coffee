gulp = require 'gulp'
connect = require 'gulp-connect'
stylus = require 'gulp-stylus'
coffee = require 'gulp-coffee'
uglify = require('gulp-uglify-es').default
concat = require 'gulp-concat'

gulp.task 'connect', ->
	connect.server
		port: 8080
		livereload: on
		root: '.'

gulp.task 'stylus', ->
	src = gulp.src 'stylus/*.styl';
	try
		src = src
			.pipe stylus compress: on
			.pipe gulp.dest 'css'
	catch e
		console.log e
	src


gulp.task 'concat', ->
	gulp.src [
		'!css/preloader.css',
		'css/*.css']
		.pipe concat 'style.min.css', newLine: ''
		.pipe gulp.dest 'dist'
		.pipe do connect.reload
		.on 'error', (err) ->
			console.log err

gulp.task 'coffee', ->
	src = gulp.src ['coffee/*.coffee', 'coffee/**/*.coffee']
	try
		src = src
			.pipe coffee bare: on
			.pipe gulp.dest 'js'
			.on 'error', (err) ->
				console.log err
	catch e
		console.log e
	src

gulp.task 'js_concat', ->
	gulp.src [
		#'js/a_start_wrappper.js',
		'js/*.js',
		'js/**/*.js',
		'js/data/**/*.js']#,
		#'js/z_end_wrapper.js']
		.pipe concat 'core.min.js', newLine: ''
		#.pipe do uglify
		.pipe gulp.dest 'dist'
		.pipe do connect.reload
		.on 'error', (err) ->
			console.log err

gulp.task 'html', ->
	gulp.src '*.html'
		.pipe do connect.reload

gulp.task 'watch', ->
	gulp.watch 'stylus/*.styl', ['stylus']
	gulp.watch 'css/*.css', ['concat']
	gulp.watch '*.html', ['html']
	gulp.watch ['coffee/*.coffee', 'coffee/**/*.coffee'], ['coffee']
	gulp.watch ['js/*.js', 'js/**/*.js'], ['js_concat']

gulp.task 'default', [
	'stylus',
	'concat', 
	'coffee',
	'js_concat',
	'connect',
	'watch']
