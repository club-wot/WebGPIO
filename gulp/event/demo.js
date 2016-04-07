const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('demo', cb => runSequence(
  'build',
  cb
));
