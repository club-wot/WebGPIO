import ROOT_DIRS from './rootDirs';

const PATHS = {
  gulp: {
    src: [
      `${ROOT_DIRS.gulp}/**/*.js`,
    ],
  },
  script: {
    src: [
      `${ROOT_DIRS.src}/**/!(*spec|*mock).js`,
    ],
  },
  test: {
    src: [
      `${ROOT_DIRS.src}/**/(*spec|*mock).js`,
    ],
    karma: `${ROOT_DIRS.root}/**/(*spec|*mock).js`,
  },
  report: {
    coverage: `${ROOT_DIRS.report}/coverage`,
  },
};

export { PATHS as default };
