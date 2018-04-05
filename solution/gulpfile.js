/// <binding BeforeBuild='clean, min' Clean='clean' ProjectOpened='watch' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename");

var paths = {
    src: "./src/",
    dist: "./dist/"
};

paths.js = paths.src + "js/*.js";
paths.css = paths.src + "css/**/*.css";
//paths.concatJsDest = paths.webroot + "js/transformable.min.js";
//paths.concatCssDest = paths.webroot + "css/transformable.min.css";

gulp.task("clean:js", function (cb) {
    rimraf(paths.dist + "js/*.*", cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.dist + "css/*.*", cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
  return gulp.src(paths.js)
      .pipe(concat('transformable.js'))
      .pipe(gulp.dest('./dist/js/'))
      .pipe(concat('transformable.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js/'));
}); 

gulp.task("min:css", function () {
    return gulp.src([paths.css])
        .pipe(concat('transformable.css'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task("examples", function () {
    gulp.src(paths.src + "examples.html")
        .pipe(rename("index.html"))
        .pipe(gulp.dest('./demo/'))
});

gulp.task("min", ["min:js", "min:css", "examples"]);
gulp.task('watch', function () {
    return gulp.watch([paths.js, "./src/examples.html"], ['min']);
});