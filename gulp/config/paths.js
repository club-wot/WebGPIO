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
  },
};

export { PATHS as default };
