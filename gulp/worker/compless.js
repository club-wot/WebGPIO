const config = require('../config');

const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const insert = require('gulp-insert');

//var concat = require('gulp-concat');

gulp.task('compless:gpio', ()=> {
  return gulp.src(config.paths.script.gpio.src)
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

gulp.task('compless:i2c', ()=> {
  return gulp.src(config.paths.script.i2c.src)
    .pipe(concat('webi2c.js'))
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

gulp.task('compless:worker_gpio', ()=> {
  return gulp.src(config.paths.script.worker.gpio.src)
    .pipe(concat('worker.gpio.js'))
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
gulp.task('compless:worker_i2c', ()=> {
  return gulp.src(config.paths.script.worker.i2c.src)
    .pipe(concat('worker.i2c.js'))
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
