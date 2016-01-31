import util from './util';
import basic from './basic.config';

const config = require('../gulp/config');

module.exports = function(karmaConfig) {
  basic.coverageReporter.reporters= [{
    type: 'html',
    dir: config.paths.report.coverage,
    subdir: util.normalizationBrowserName,
  }];
  karmaConfig.set(basic);
}
