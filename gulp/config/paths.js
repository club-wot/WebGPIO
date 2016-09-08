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
    gpio: {
      src: [
        `${ROOT_DIRS.srcGPIO}/**/!(*spec|*mock).js`,
        `${ROOT_DIRS.srcCOMMON}/**/!(*spec|*mock).js`,
      ],
    },
    i2c: {
      src: [
        `${ROOT_DIRS.srcI2C}/**/!(*spec|*mock).js`,
        `${ROOT_DIRS.srcCOMMON}/**/!(*spec|*mock).js`,
      ],
    },
    worker: {
      src: [
        `${ROOT_DIRS.srcWORKER}/**/!(*spec|*mock).js`,
      ],
    },
    simulator: {
      src: [
        `${ROOT_DIRS.srcSIMULATOR}/**/!(*spec|*mock).js`,
        `${ROOT_DIRS.srcCOMMON}/config/**/!(*spec|*mock).js`,
        ],
    }
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
