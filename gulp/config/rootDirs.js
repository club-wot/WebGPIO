const cwd = process.cwd();

const ROOT_DIRS = {
  root: `${cwd}`,
  demo: `${cwd}/demo`,
  dist: `${cwd}/dist`,
  gulp: `${cwd}/gulp`,
  src: `${cwd}/src`,
  srcPOLYFILL: `${cwd}/src/polyfill`,
  srcGPIO: `${cwd}/src/WebGPIO`,
  srcI2C: `${cwd}/src/WebI2C`,
  srcCOMMON: `${cwd}/src/common`,
  srcWORKER: `${cwd}/src/Worker`,
  tmp: `${cwd}/.tmp`,
  node: `${cwd}/node_modules`,
  report: `${cwd}/report`,
};

export { ROOT_DIRS as default };
