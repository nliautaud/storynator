var gulp = require('gulp');
var inlinesource = require('gulp-inline-source');

var paths = {
    html: 'src/*.html',
    scripts: 'src/js/**/*.js',
    styles: 'src/styles/**/*.css'
};

gulp.task('default', function () {
    return gulp.src(paths.html)
        .pipe(inlinesource())
        .pipe(gulp.dest('.'));
});

gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['default']);
});