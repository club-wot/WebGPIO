const cwd = process.cwd();

const ROOT_DIRS = {
  dist: `${cwd}/dist`,
  gulp: `${cwd}/gulp`,
  src: `${cwd}/src`,
  tmp: `${cwd}/.tmp`,
  node: `${cwd}/node_modules`,
};

export { ROOT_DIRS as default };
