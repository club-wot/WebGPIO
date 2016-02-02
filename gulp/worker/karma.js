const config = require('../config');

const gulp = require('gulp');
const Server = require('karma').Server;

const browserSync = require('browser-sync');

gulp.task('test', () => {
  const server = new Server({
    configFile: `${process.cwd()}/karma/build.config.js`,
    singleRun: true,
  });
  server.start();
});

gulp.task('test:watch', () => {
  const server = new Server({
    configFile: `${process.cwd()}/karma/livereload.config.js`,
    singleRun: false,
    autoWatch: true,
  });
  server.start();
  gulp.watch(`${config.rootDirs.src}/**/*.js`, browserSync.get(config.browserSync.namespace.report).reload);
});
