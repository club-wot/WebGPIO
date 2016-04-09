const config = require('../config');

const gulp = require('gulp');
const Server = require('karma').Server;

const browserSync = require('browser-sync');

var normalizationBrowserName = browser=> browser.toLowerCase().split(/[ /-]/)[0];

gulp.task('karma', () => {
  const server = new Server({
    configFile: `${process.cwd()}/karma/build.config.js`,
    singleRun: true,
  });
  server.start();
});

gulp.task('karma:watch', () => {
  const serverGPIO = new Server({
      configFile: `${process.cwd()}/karma/livereload.config.js`,
      files: [
        { pattern: `${config.rootDirs.srcGPIO}/**/*.js`, watched: true },
        { pattern: `${config.rootDirs.srcCOMMON}/**/*.js`, watched: true },
        { pattern: `${config.rootDirs.src}/polyfill/**/*.js`, watched: true },
      ],
      coverageReporter: {
        dir: `${config.paths.report.coverage}/gpio`,
        reporters: [{
          type: 'text', subdir: 'text',
        }, {
          type: 'html', subdir: 'html',
        }, ],
      },
      singleRun: false,
      autoWatch: true,
    });

  const serverI2C = new Server({
      configFile: `${process.cwd()}/karma/livereload.config.js`,
      files: [
        { pattern: `${config.rootDirs.srcI2C}/**/*.js`, watched: true },
        { pattern: `${config.rootDirs.srcCOMMON}/**/*.js`, watched: true },
        { pattern: `${config.rootDirs.src}/polyfill/**/*.js`, watched: true },
      ],
      coverageReporter: {
        dir: `${config.paths.report.coverage}/i2c`,
        reporters: [{
          type: 'text', subdir: 'text',
        }, {
          type: 'html', subdir: 'html',
        }, ],
      },
      singleRun: false,
      autoWatch: true,
    });

  const serverWorker = new Server({
          configFile: `${process.cwd()}/karma/livereload.config.js`,
          files: [
            { pattern: `${config.rootDirs.srcWORKER}/**/*.js`, watched: true },
          ],
          coverageReporter: {
            dir: `${config.paths.report.coverage}/worker`,
            reporters: [{
              type: 'text', subdir: 'text',
            }, {
              type: 'html', subdir: 'html',
            }, ],
          },
          singleRun: false,
          autoWatch: true,
        });

  serverGPIO.start();
  serverI2C.start();
  serverWorker.start();

  gulp.watch(`${config.rootDirs.src}/**/*.js`, browserSync.get(config.browserSync.namespace.report).reload);
});
