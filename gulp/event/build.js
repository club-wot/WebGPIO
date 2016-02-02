const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('build', cb => runSequence(
  ['jscs:fix', 'jscs:gulpfix'],
  'clean',
  'test',
  'compless',
  cb
));
