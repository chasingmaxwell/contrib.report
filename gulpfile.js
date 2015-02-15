/**
 * @file
 * Portable Gulp tool that checks a Meteor installation for js and scss syntax errors.
 */
/* globals require */

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    scsslint = require('gulp-scss-lint');

/**
 * @task lint
 *   Runs JSCS and JSLint on module, theme, and gulp files. Excludes all
 *   minified JavaScript files.
 */
gulp.task('cs', function () {
  return gulp.src([
    '**/*.js',
    '!src/.meteor/**/*.js',
    '!src/packages/**/*.js',
    '!node_modules/**/*.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(jscs());
});

/**
 * @task scss-lint
 *  Check for errors in the styles
 */
gulp.task('scss-lint', function() {
  gulp.src('!src/client/scss/*.scss')
  .pipe(scsslint());
});
