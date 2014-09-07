var gulp = require('gulp'),
    express = require('express'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    rename = require('gulp-rename');

var serverport = 5001;

var paths = {
    scripts: ['src/**/*.js'],
    examples: ['examples/**/*.html'],
    libs: ['lib/filereader.js/filereader.js', 'lib/d3/d3.js'],
    data: ['data/**/*.*'],
    dist: ['dist/**/*.js']
};


var server = express();
server.use(express.static('./dist-examples'));


// main task for development, watches files and rebuilds
// library and examples when needed
gulp.task('serve', ['dist', 'watch'], function() {
    console.log('Server port: ' + serverport);
    server.listen(serverport);
});

// main task to build the distribution and examples
gulp.task('dist', ['dist-library', 'dist-examples']);

// @private
// dist the library
gulp.task('dist-library', ['clean-library'], function() {
    return gulp.src(paths.scripts)
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});

// @private
// dist the examples
gulp.task('dist-examples', ['clean-examples', 'dist-library'], function() {
    return gulp.src([].concat.call([], paths.dist, paths.examples, paths.libs, paths.data))
        .pipe(gulp.dest('dist-examples'));
});

// @private
gulp.task('clean-library', function(cb) {
    del(['dist'], cb);
});

// @private
gulp.task('clean-examples', function(cb) {
    del(['dist-examples'], cb);
});

// @private
// run dist on file change: library/libraries/html's
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['dist']);
    gulp.watch(paths.examples, ['dist']);
    gulp.watch(paths.libs, ['dist']);
    gulp.watch(paths.data, ['dist']);
});

// let dist be the default task
gulp.task('default', ['dist']);
