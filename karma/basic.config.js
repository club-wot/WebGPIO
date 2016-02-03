import util from './util';

const config = require('../gulp/config');

const CONFIG = {

  basePath: '',
  frameworks: ['jasmine'],
  files: [
    {pattern: `${config.rootDirs.src}/**/*.js`, watched: true},
  ],
  exclude: [],
  preprocessors: {
    [config.paths.script.src]: ['coverage'],
  },
  reporters: ['progress', 'coverage'],
  coverageReporter: {
    dir: config.paths.report.coverage,
    reporters:  [
      { type: 'html', subdir: 'html' },
      { type: 'lcov', subdir: 'lcov' },
      { type: 'text-summary' },
    ]
  },
  port: config.ports.karma,
  colors: true,
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  logLevel: config.LOG_INFO,
  autoWatch: false,
  browsers: ['Firefox'],
  singleRun: false,
  concurrency: Infinity
};

export { CONFIG as default };
