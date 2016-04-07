const config = require('../config');
const gulp = require('gulp');
const browserSyncReport = require('browser-sync').create(config.browserSync.namespace.report);
const browserSyncDemo = require('browser-sync').create(config.browserSync.namespace.demo);

gulp.task('browser-sync:report', () => {
  browserSyncReport.init(config.browserSync.report);
});

gulp.task('browser-sync:demo', () => {
  browserSyncDemo.init(config.browserSync.demo);
});
