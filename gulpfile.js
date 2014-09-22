// For more information on how to configure a task runner, please visit:
// https://github.com/gulpjs/gulp

var gulp    = require('gulp');
var clean   = require('gulp-clean');
var rename  = require('gulp-rename');
var sass    = require('gulp-sass');
var csso    = require('gulp-csso');
var jade    = require('gulp-jade');
var fs      = require('fs');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');
var dist    = './dist/'; 

gulp.task('clean', function () {
  // Clear the destination folder
  gulp.src(dist + '**/*.*', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('copy-html', [], function () {

  var locals = ['en', 'it', 'es'];

  locals.forEach(function(local) {
    var locals = JSON.parse(fs.readFileSync('./src/i18n/' + local + '.json', 'utf8'));
    locals['currentLang'] = local;
    gulp.src('./src/jade/pages/**/*.jade')
      .pipe(rename(function (path) {
        locals['currentTab'] = path.basename != 'index'? path.basename : '';
      }))
      .pipe(jade({
        locals: locals
      }))
      .pipe(rename(function (path) {
        if (path.basename != 'index') {
          path.dirname += "/" + path.basename;
          path.basename = "index";
        }
      }))
      .pipe(gulp.dest(dist + local));
    if (local === 'en') {
      gulp.src('./src/jade/*.jade')
        .pipe(jade({
          locals: locals
        }))
        .pipe(gulp.dest(dist))
    }
  });


});

gulp.task('copy', function () {
  gulp.src('./src/static/*').pipe(gulp.dest(dist))
  gulp.src('./src/static/img/*').pipe(gulp.dest(dist + 'img'))
  gulp.src('./src/static/img/rescaled/*').pipe(gulp.dest(dist + 'img'))
  gulp.src('./src/js/vendor/**/*.min.*').pipe(gulp.dest(dist + 'js/vendor/'))
  gulp.src('./src/scss/fontello/**/*').pipe(gulp.dest(dist + 'css/fontello')).on('error', errorHandler)
  gulp.src('./src/scss/opensans/**/*').pipe(gulp.dest(dist + 'css/opensans')).on('error', errorHandler)
});

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  gulp.src(['src/js/*.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist + 'js/'));

  gulp.src(['src/js/vendor/foundation*.js'])
    .pipe(concat('foundation.min.js'))
    .pipe(uglify()) 
    .pipe(gulp.dest(dist + 'js/vendor/'));
});

gulp.task('styles', function () {
  return gulp.src('src/scss/app.scss')
      .pipe(sass())
      .pipe(rename('app.css'))
      .pipe(csso())
      .pipe(gulp.dest(dist + 'css'))
});

gulp.task('watch', ['styles'], function () {
  gulp.watch(['src/jade/**/*.jade'], ['copy-html']);
  gulp.watch(['src/scss/**/*.scss'], ['styles']);
  gulp.watch(['src/js/**/*'], ['scripts']);
  gulp.watch(['src/img/**/*', './src/i18n/*.json'], ['copy']);
});

// The dist task (used to store all files that will go to the server)
gulp.task('dist', ['clean', 'copy-html', 'copy', 'scripts', 'styles']);

// The default task (called when you run `gulp`)
gulp.task('default', ['dist', 'watch']);

// Handle the error
function errorHandler (error) {
  console.log(error.toString());
}