const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('dev', cb => runSequence('test:watch', cb));
