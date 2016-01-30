
import gulpLoadPlugins from 'gulp-load-plugins';
import requireDir from 'require-dir';

gulpLoadPlugins();
requireDir('./gulp',{recurse:true});
