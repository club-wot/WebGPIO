import util from './util';
import basic from './basic.config';

const config = require('../gulp/config');

module.exports = function(karmaConfig) {
  karmaConfig.set(basic);
}
