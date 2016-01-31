const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('build', cb => runSequence(
  ['jscs', 'jscs:gulp'],
  'clean',
  'test',
  'compless',
  cb
));
