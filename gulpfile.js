// For more information on how to configure a task runner, please visit:
// https://github.com/gulpjs/gulp

var gulp    = require('gulp');
var rimraf  = require('gulp-rimraf');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');

var webserver = require('gulp-webserver');

var dist    = './js/';

gulp.task('clean', function (cb) {
  rimraf(dist, cb);
});

gulp.task('copy', function () {
  gulp.src('./_js/vendor/**/*.min.*').pipe(gulp.dest(dist + 'vendor/'))
});

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  gulp.src([
    '_js/vendor/jquery*.js',
    '_js/vendor/lodash*.js',
    '_js/vendor/foundation.js',
    '_js/vendor/foundation.topbar.js',
    //'_js/vendor/foundation.tab.js',
    '_js/vendor/foundation.interchange.js',
//    '_js/vendor/foundation.magellan.js',
    '_js/*.js'
    ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist));
});

gulp.task('watch', function () {
  gulp.watch(['_js/**/*'], ['scripts']);
});

// The dist task (used to store all files that will go to the server)
gulp.task('dist', ['clean', 'copy', 'scripts']);

// The default task (called when you run `gulp`)
gulp.task('default', ['dist', 'watch']);

// Handle the error
function errorHandler (error) {
  console.log(error.toString());
}