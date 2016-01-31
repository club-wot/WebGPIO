const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('build', cb => runSequence(
  'test',
  cb,
));
