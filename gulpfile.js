var gulp = require('gulp'),
    combineMq = require('gulp-combine-mq'),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    fileinclude = require('gulp-file-include'),
    watch = require('gulp-watch');

//Path vars
var html_build = "_html/build/templates/*.html",
    html_build_watch = "_html/build/**/*.html",
    html_output = "_html"; 

//Twig HTML build
gulp.task('compile', function () {
    'use strict';
    var twig = require('gulp-twig');
    return gulp.src('./index.twig')
        .pipe(twig({
            data: {
                title: 'Gulp and Twig',
                benefits: [
                    'Fast',
                    'Flexible',
                    'Secure'
                ]
            }
        }))
        .pipe(gulp.dest('./'));
});

//HTML File Build
gulp.task('fileinclude', function(){
    gulp.src([html_build])
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(html_output));
});

//Combines media queries
gulp.task('combineMq', function() {
    var postcss = require('gulp-postcss');
    var autoprefixer = require('autoprefixer');
    return gulp.src('css/main.css')
        .pipe(combineMq({
            beautify: true
        }))
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest('css.min'));
});

//Less Compile. To be removed once project is converted to SASS
gulp.task('compile-less', function() {  
    gulp.src('less/main.less')
      .pipe(less())
      .pipe(gulp.dest('css'));
});

//Watch Less Files. To be removed once project is converted to SASS 
gulp.task('watch-less', function() {  
    gulp.watch('less/**/*.less' , ['compile-less']);
});

//Watch HTML files. Separating the two watches since less will be removed
gulp.task('watch-html', function() {  
    gulp.watch(html_build_watch, ['fileinclude']);
});

gulp.task('default', ['combineMq','compile', 'fileinclude', 'compile-less', 'watch-less', 'watch-html']);