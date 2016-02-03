const config = require('../config');

const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const insert = require('gulp-insert');

//var concat = require('gulp-concat');

gulp.task('compless', ()=> {
  return gulp.src(config.paths.script.src)
    .pipe(concat('webgpio.js'))
    .pipe(insert.wrap('(function(){', '})()'))
    .pipe(gulp.dest(config.rootDirs.dist))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(babel({
      presets: [],
      plugins: ['transform-es2015-arrow-functions'],
    }))
    .pipe(uglify({
      compress:true,
    }))
    .pipe(gulp.dest(config.rootDirs.dist));
});
