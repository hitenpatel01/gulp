/// <binding BeforeBuild='debug' Clean='clean' />
"use strict";
var concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    gulp = require("gulp"),
    Karma = require("karma").Server,
    rimraf = require("rimraf"),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    tsd = require('gulp-tsd'),
    tslint = require('gulp-tslint'),
    uglify = require("gulp-uglify"),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    ignore = require('gulp-ignore');
var tsProjectSrc = ts.createProject({
    removeComments: false,
    noImplicitAny: true,
    noEmitHelpers: false,
    noEmitOnError: true,
    noLib: false,
    target: 'es5',
    noExternalResolve: false,
    sortOutput: true
});
var tsProjectSpec = ts.createProject({
    removeComments: false,
    noImplicitAny: true,
    noEmitHelpers: false,
    noEmitOnError: true,
    noLib: false,
    target: 'es5',
    noExternalResolve: false,
    sortOutput: true
});
var paths = {
    webroot: ".",
    output: "/dist"
};
paths.cssSrc = paths.webroot + "/css/**/*.css";
paths.cssOutput = paths.webroot + paths.output + "/*.css*";
paths.cssOutputFile = paths.webroot + paths.output + "/app.css";
paths.cssOutputMinFile = paths.webroot + paths.output + "/app.min.css";
paths.tsSrc = paths.webroot + "/src/**/*.ts";
paths.specSrc = paths.webroot + "/src/**/specs/*.ts";
paths.tsSpecOutputFile = paths.webroot + paths.output + "/specs.js";
paths.tsOutputFile = paths.webroot + paths.output + "/app.js";
paths.tsOutputMinFile = paths.webroot + paths.output + "/app.min.js";
gulp.task('tslint', function () {
    return gulp.src(paths.tsSrc)
        .pipe(tslint({ configuration: './tslint.json' }))        
		.pipe(tslint.report('verbose'));
});
gulp.task('spec', ['clean:spec', 'tslint'], function () {
    var tsResult = gulp.src(paths.specSrc)
        .pipe(ts(tsProjectSpec));
    return tsResult.js
        .pipe(concat(paths.tsSpecOutputFile))
        .pipe(gulp.dest("."));
});
gulp.task('src', ['clean:src', 'tslint'], function () {	
    var tsResult = gulp.src([paths.tsSrc, "!" + paths.unitTestSrc])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProjectSrc));
    return tsResult.js
        .pipe(concat(paths.tsOutputFile))
        //write comments to tell istanbul to ignore the code inside the iife parameters
        .pipe(replace(/(}\)\()(.*\|\|.*;)/g, '$1/* istanbul ignore next */$2'))
        //write comments to tell istanbul to ignore the extends code that typescript generates
        .pipe(replace(/(var __extends = \(this && this.__extends\))/g, '$1/* istanbul ignore next */'))
        .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: '/src/' }))
        .pipe(gulp.dest("."))
        .pipe(ignore.exclude("*.map"))
        .pipe(uglify())
        .pipe(rename(paths.tsOutputMinFile))
        .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: '/src/' }))
        .pipe(gulp.dest("."));
});
gulp.task("css", ['clean:css'], function () {
    return gulp.src(paths.cssSrc)
        .pipe(concat(paths.cssOutputFile))
        .pipe(gulp.dest("."))
		.pipe(cssmin())
		.pipe(rename(paths.cssOutputMinFile))
        .pipe(gulp.dest("."));
});
gulp.task("type-definitions", function () {
    return gulp.src('./gulp_tsd.json').pipe(tsd());
});
gulp.task("test:single", ["spec"], function () {
    new Karma({
        configFile: __dirname + '/karma.conf.js',
        browsers: ['Chrome'],
        singleRun: true
    }).start();
});
gulp.task("clean:src", function (cb) {
	rimraf(paths.webroot + paths.output + "/app*.js*", cb);
});
gulp.task("clean:css", function (cb) {
	rimraf(paths.webroot + paths.output + "/*.css*", cb);
});
gulp.task("clean:spec", function (cb) {
    rimraf(paths.webroot + paths.output + "/specs.js", cb);
});
gulp.task("clean", ["clean:src", "clean:spec", "clean:css"]);
gulp.task("default", ["src", "spec", "css"]);