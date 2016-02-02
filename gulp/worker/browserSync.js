const config = require('../config');
const gulp = require('gulp');
const browserSync = require('browser-sync').create(config.browserSync.namespace.report);

gulp.task('browser-sync:report', () => {
  browserSync.init(config.browserSync.report);
});
