'use strict';

var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');
var options = require('gulp-options');

var env = options.has('env') ? options.get('env') : 'development';

gulp.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e'
};

require('require-dir')('./gulp');

gulp.task('build-config', function () {
  gulp.src('config.app.json')
    .pipe(
      gulpNgConfig('myApp.config', {
        environment: ['env.' + env, 'global']
      })
    )
    .pipe(gulp.dest('./src/app'))
});

gulp.task('build', ['clean'], function () {
    gulp.start('buildapp');
});
