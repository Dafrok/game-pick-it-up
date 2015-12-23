var gulp = require('gulp')
var autoprefixer = require('gulp-autoprefixer')
var minifyCss = require('gulp-minify-css')
var browserSync = require('browser-sync')
//var babel = require('gulp-babel')
var browserify = require('gulp-browserify')
var plumber = require('gulp-plumber')
var jade = require('gulp-jade')
var stylus = require('gulp-stylus')

gulp.task('js', function () {
  gulp.src('src/js/**.js')
    .pipe(plumber())
    .pipe(browserify())
    .pipe(gulp.dest('dist/js'))
})

gulp.task('css', function () {
  gulp.src('src/stylus/**.styl')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css'))
})

gulp.task('html', function () {
  gulp.src('src/jade/**.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('dist/html'))
})

gulp.task('resource', function () {
  gulp.src('src/resource/**')
    .pipe(gulp.dest('dist/resource'))
})

gulp.task('browserSync', function () {
  browserSync({
    server:{
      baseDir:'dist',
      index:'html/index.html'
    }
  })
  gulp.watch('dist/**', ['reload'])
  gulp.watch('src/stylus/**', ['css'])
  gulp.watch('src/jade/**', ['html'])
  gulp.watch('src/js/**', ['js'])
  gulp.watch('src/resource/**', ['resource'])
})

gulp.task('reload', function () {
  browserSync.reload()
})

gulp.task('default', ['css', 'html', 'js', 'resource', 'browserSync'])