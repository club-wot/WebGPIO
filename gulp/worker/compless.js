const config = require('../config');

const gulp = require('gulp');
var  concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

//var concat = require('gulp-concat');

gulp.task('compless', ()=> {
  return gulp.src(config.paths.script.src)
    .pipe(concat('webgpio.js'))
    .pipe(gulp.dest(config.rootDirs.dist))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(uglify({
      compress:true,
    }))
    .pipe(gulp.dest(config.rootDirs.dist));
});
