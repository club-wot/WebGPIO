const cwd = process.cwd();

const ROOT_DIRS = {
  root: `${cwd}`,
  dist: `${cwd}/dist`,
  gulp: `${cwd}/gulp`,
  src: `${cwd}/src`,
  tmp: `${cwd}/.tmp`,
  node: `${cwd}/node_modules`,
  report: `${cwd}/report`,
};

export { ROOT_DIRS as default };
