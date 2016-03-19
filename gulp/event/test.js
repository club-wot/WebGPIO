const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('test', cb => runSequence(
  'karma',
  cb));

gulp.task('test:watch', cb => runSequence(
  'karma:watch',
  cb));
