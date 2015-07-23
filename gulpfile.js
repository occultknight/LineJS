var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var del = require('del');

var paths = {
    src: 'src/**/*.js',
    dist: 'dist/'
};

gulp.task('clean', function (cb) {
    del([paths.dist], cb);
});

gulp.task('jshint', function (cb) {
    return gulp.src(paths.src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('uglify', ['clean'], function (cb) {
    return gulp.src(paths.src)
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('default', ['jshint', 'uglify']);