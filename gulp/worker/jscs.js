const config = require('../config');

const gulp = require('gulp');
const jscs = require('gulp-jscs');

gulp.task('jscs', () => gulp.src(config.paths.script.src)
    .pipe(jscs({ fix: false }))
    .pipe(jscs.reporter()));

gulp.task('jscs:gulp', () => gulp.src(config.paths.gulp.src)
    .pipe(jscs({ fix: false }))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail')));
