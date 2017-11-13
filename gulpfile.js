var gulp = require('gulp');
var inlinesource = require('gulp-inline-source');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var paths = {
    html: 'src/*.html',
    scripts: 'src/js/**/*.js',
    styles: 'src/styles/**/*.css'
};

gulp.task('libs', function () {
    return browserify()
        .require('jquery')
        .require('sortablejs')
        .require('svgjs')
        .require('svg.draw.js')
        .bundle()
        .pipe(source('libs.js'))
        .pipe(gulp.dest('./src/scripts/'));
});

gulp.task('build', function () {
    return gulp.src(paths.html)
        .pipe(inlinesource({ swallowErrors: true }))
        .pipe(gulp.dest('.'));
});

gulp.task('watch', function () {
    gulp.watch('src/**/*', ['build']);
});

gulp.task('default', ['libs', 'build', 'watch']);