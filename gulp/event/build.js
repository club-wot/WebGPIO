const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('build', cb => runSequence(
  ['jscs:fix', 'jscs:gulpfix'],
  'clean',
  'test',
  'compless:gpio',
  'compless:i2c',
  ['compless:worker_gpio', 'compless:worker_i2c'],
  cb
));
