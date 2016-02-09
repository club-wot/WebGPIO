const cwd = process.cwd();

const ROOT_DIRS = {
  root: `${cwd}`,
  dist: `${cwd}/dist`,
  gulp: `${cwd}/gulp`,
  src: `${cwd}/src`,
  srcGPIO: `${cwd}/src/WebGPIO`,
  srcI2C: `${cwd}/src/WebI2C`,
  srcCONFIG: `${cwd}/src/config`,
  tmp: `${cwd}/.tmp`,
  node: `${cwd}/node_modules`,
  report: `${cwd}/report`,
};

export { ROOT_DIRS as default };
