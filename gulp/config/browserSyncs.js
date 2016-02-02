import PORTS     from './ports';
import PATHS     from './paths';
import ROOT_DIRS from './rootDirs';

const BROWSER_SYNC = {
  namespace: {
    dev: 'livereload',
    report: 'report',
  },
  report: {
    notify: true,
    port: PORTS.report,
    browser: 'firefox',
    files: [
      /** match pattern : https://github.com/es128/anymatch  */
      new RegExp(`${PATHS.report.coverage}/*.(js|css|html)`),
    ],
    server: {
      baseDir: `${PATHS.report.coverage}`,
      directory: true,

      //index: "index.htm",
    },
  },
};

export { BROWSER_SYNC as default };
