'use strict';
const gulp = require('gulp');
const webpack = require('webpack-stream');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const wp = require('webpack');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

var settings = {
  productionApiUri: 'https://powerful-hollows-96528.herokuapp.com/',
  localApiUri: 'http://localhost:3000/'
};

var paths = {
  dev: {
    css: 'app/css/**/*.scss',
    html: 'app/**/*.html',
    js: 'app/js/**/*.js',
    test: 'test/*_test.js',
    libs: 'libs/*',
    data: 'app/data/*.json'
  },
  build: {
    main: 'build/',
    css: 'build/css',
    js: 'build/js',
    libs: 'build/libs',
    data: 'build/data',
    test: 'test/'
  },
  production: {
    main: 'public/',
    css: 'build/css',
    data: 'build/data',
    js: 'build/js'
  }
};

gulp.task('watch', function () {
  gulp.watch(paths.dev.html, ['statichtmlfiles:dev']);
  gulp.watch(paths.dev.js, ['bundle']);
  gulp.watch(paths.dev.css, ['staticcssfiles:dev']);
  gulp.watch(paths.dev.test, ['bundle:test']);
  gulp.watch(paths.dev.libs, ['libfiles:dev']);

});

gulp.task('staticcssfiles:dev', () => {
  gulp.src(paths.dev.css)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.build.main));
});

gulp.task('staticcssfiles:production', () => {
  gulp.src(paths.dev.css)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.production.main));
});

gulp.task('libfiles:dev', () => {
  return gulp.src(paths.dev.libs)
    .pipe(gulp.dest(paths.build.libs));
});

gulp.task('libfiles:production', () => {
  return gulp.src(paths.dev.libs)
    .pipe(gulp.dest(paths.production.libs));
});

gulp.task('statichtmlfiles:dev', () => {
  return gulp.src(paths.dev.html)
    .pipe(gulp.dest(paths.build.main));
});

gulp.task('statichtmlfiles:production', () => {
  return gulp.src(paths.dev.html)
    .pipe(gulp.dest(paths.production.main));
});

gulp.task('staticdata:dev', () => {
  return gulp.src(paths.dev.data)
    .pipe(gulp.dest(paths.build.data));
});

// gulp.task('staticdata:production', () => {
//   return gulp.src(paths.dev.data)
//     .pipe(gulp.dest(paths.production.data));
// });

gulp.task('bundle', () => {
  var webpackplugin = new wp.DefinePlugin({
    'process.env': {
      URI: JSON.stringify(settings.localApiUri)
    }
  });
  return gulp.src(__dirname + '/app/js/client.js')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      },
      plugins: [webpackplugin]
    }))
    // .pipe(babel({
    //   presets: ['es2015']
    // }))
    .pipe(gulp.dest(paths.build.main));
});

gulp.task('bundle:production', () => {
  var webpackplugin = new wp.DefinePlugin({
    'process.env': {
      URI: JSON.stringify(settings.productionApiUri)
    }
  });
  return gulp.src(__dirname + '/app/js/client.js')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      },
      plugins: [webpackplugin]
    }))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(paths.production.main));
});

gulp.task('bundle:test', () => {
  var webpackplugin = new wp.DefinePlugin({
    'process.env': {
      URI: JSON.stringify(settings.localApiUri)
    }
  });
  return gulp.src(paths.dev.test)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(webpack({
      output: {
        filename: 'test_bundle.js'
      },
      plugins: [webpackplugin],
      module: {
        loaders: [{
          test: /\.html$/,
          loader: 'html'
        }]
      }
    }))
    .pipe(gulp.dest(paths.build.test));
});

gulp.task('default', ['bundle', 'statichtmlfiles:dev', 'staticcssfiles:dev', 'staticdata:dev', 'libfiles:dev']);
gulp.task('build:production', ['bundle:production', 'statichtmlfiles:production', 'staticcssfiles:production', 'libfiles:production']);
