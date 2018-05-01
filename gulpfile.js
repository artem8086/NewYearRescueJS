(function() {
  var coffee, concat, connect, gulp, stylus, uglify;

  gulp = require('gulp');

  connect = require('gulp-connect');

  stylus = require('gulp-stylus');

  coffee = require('gulp-coffee');

  uglify = require('gulp-uglify-es')["default"];

  concat = require('gulp-concat');

  gulp.task('connect', function() {
    return connect.server({
      port: 8080,
      livereload: true,
      root: '.'
    });
  });

  gulp.task('stylus', function() {
    var e, src;
    src = gulp.src('stylus/*.styl');
    try {
      src = src.pipe(stylus({
        compress: true
      })).pipe(gulp.dest('css'));
    } catch (_error) {
      e = _error;
      console.log(e);
    }
    return src;
  });

  gulp.task('concat', function() {
    return gulp.src(['!css/preloader.css', 'css/*.css']).pipe(concat('style.min.css', {
      newLine: ''
    })).pipe(gulp.dest('dist')).pipe(connect.reload());
  });

  gulp.task('coffee', function() {
    var e, src;
    src = gulp.src(['coffee/*.coffee', 'coffee/**/*.coffee']);
    try {
      src = src.pipe(coffee({
        bare: true
      })).pipe(gulp.dest('js'));
    } catch (_error) {
      e = _error;
      console.log(e);
    }
    return src;
  });

  gulp.task('js_concat', function() {
    return gulp.src(['js/*.js', 'js/**/*.js']).pipe(concat('core.min.js', {
      newLine: ''
    })).pipe(gulp.dest('dist')).pipe(connect.reload());
  });

  gulp.task('html', function() {
    return gulp.src('*.html').pipe(connect.reload());
  });

  gulp.task('watch', function() {
    gulp.watch('stylus/*.styl', ['stylus']);
    gulp.watch('css/*.css', ['concat']);
    gulp.watch('*.html', ['html']);
    gulp.watch(['coffee/*.coffee', 'coffee/**/*.coffee'], ['coffee']);
    return gulp.watch(['js/*.js', 'js/**/*.js'], ['js_concat']);
  });

  gulp.task('default', ['stylus', 'concat', 'coffee', 'js_concat', 'connect', 'watch']);

}).call(this);
