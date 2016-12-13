import PORTS     from './ports';
import PATHS     from './paths';
import ROOT_DIRS from './rootDirs';

const BROWSER_SYNC = {
  namespace: {
    dev: 'livereload',
    demo: 'demo',
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
  demo: {
    notify: true,
    port: PORTS.demo,
    browser: 'firefox',
    files: [
      /** match pattern : https://github.com/es128/anymatch  */
      new RegExp(`${PATHS.report.demo}/*.(js|css|html)`),
      new RegExp(`${PATHS.report.dist}/*.(js|css|html)`),
    ],
    server: {
      baseDir: [
        ROOT_DIRS.demo,
        ROOT_DIRS.dist,
        ROOT_DIRS.srcPOLYFILL,
      ],
      directory: true,
    },
  },
};

export { BROWSER_SYNC as default };
