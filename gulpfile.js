// PostCSS plugin to parse CSS and add vendor prefixes to CSS rules using values from Can I Use
const autoprefixer = require('autoprefixer');
// Browser-side require() the node.js way
const browserify = require('browserify');
// Keep multiple browsers & devices in sync when building websites
const browserSync = require('browser-sync').create();
// Convert streaming vinyl files to use buffers
const buffer = require('vinyl-buffer');
// Minify CSS with CSSO
const csso = require('gulp-csso');
// Delete files and folders
const del = require('del');
// Gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow
const gulp = require('gulp');
// Conditionally run a task
const gulpIf = require('gulp-if');
// PostCSS plugin to inline local/remote images
const imageInliner = require('postcss-image-inliner');
// Minify PNG, JPEG, GIF and SVG images with imagemin
const imagemin = require('gulp-imagemin');
// Pack same CSS media query rules into one using PostCSS
const mqpacker = require('css-mqpacker');
// Prevent pipe breaking caused by errors from gulp plugins
const plumber = require('gulp-plumber');
// Gulp plugin to pipe CSS through several plugins
const postcss = require('gulp-postcss');
// Gulp plugin for compiling Pug templates
const pug = require('gulp-pug');
// Gulp plugin to rename files
const rename = require('gulp-rename');
// Runs a sequence of gulp tasks in the specified order
const runSequence = require('run-sequence');
// Sass plugin for Gulp.
const sass = require('gulp-sass');
// Use conventional text streams at the start of your gulp or vinyl pipelines
const source = require('vinyl-source-stream');
// Source map support for Gulp
const sourcemaps = require('gulp-sourcemaps');
// Optimizing SVG vector graphics files
const svgo = require('gulp-svgo');
// Minify JavaScript with UglifyJS2
const uglify = require('gulp-uglify');
// babel with browserify
const babelify = require('babelify');
// Combine svg files into one with <symbol> elements.
const svgstore = require('gulp-svgstore');

const isProduction = process.env.NODE_ENV === 'production' ? true : false;

const SRC_FOLDER = 'source';
const BUILD_FOLDER = 'dist';

const path = {
  build: {
    css: BUILD_FOLDER + '/css',
    html: BUILD_FOLDER,
    fonts: BUILD_FOLDER + '/fonts',
    js: BUILD_FOLDER + '/js',
    img: BUILD_FOLDER + '/img'
  },
  src: {
    pug: {
      pages: SRC_FOLDER + '/pug/pages/*.pug',
      blocks: SRC_FOLDER + '/blocks/**/*.pug'
    },
    sass: {
      self: SRC_FOLDER + '/sass/style.scss',
      blocks: SRC_FOLDER + '/blocks/**/*.scss',
      folder: SRC_FOLDER + '/sass/**/*.scss'
    },
    js: {
      self: SRC_FOLDER + '/js/main.js',
      blocks: SRC_FOLDER + '/blocks/**/*.js',
      folder: SRC_FOLDER + '/js/**/*.js'
    },
    fonts: {
      folder: SRC_FOLDER + '/fonts/**/*.*'
    },
    images: {
      svg: SRC_FOLDER + '/img/**/*.svg',
      sprite: SRC_FOLDER + '/img/sprite/*.svg',
      self: SRC_FOLDER + '/img',
      folder: SRC_FOLDER + '/img/**/*.{png,jpg,gif}',
      root: SRC_FOLDER + '/img/*.{png,jpg,gif,svg}',
      favicons: SRC_FOLDER + '/img/favicons/*.*'
    },
    robots: SRC_FOLDER + '/robots.txt'
  }
};

gulp.task('html', function () {
  return gulp.src(path.src.pug.pages)
      .pipe(plumber())
      .pipe(pug())
      .pipe(gulp.dest(path.build.html))
      .pipe(browserSync.stream());
});

gulp.task('style', function () {
  return gulp.src(path.src.sass.self)
      .pipe(plumber())
      .pipe(gulpIf(!isProduction, sourcemaps.init()))
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([
        autoprefixer({browsers: [
          'Chrome >= 43',
          'Firefox >= 41',
          'Opera >= 34',
          'ie >= 10',
          'last 2 Edge versions',
          'Safari >= 7',
          'iOS >= 7',
          'ChromeAndroid >= 43'
        ]}),
        imageInliner({
          assetPaths: [path.src.images.self],
          maxFileSize: 10240,
        }),
        mqpacker({
          sort: false
        })
      ]))
      .pipe(gulpIf(!isProduction, sourcemaps.write()))
      .pipe(gulp.dest(path.build.css))
      .pipe(gulpIf(isProduction, csso()))
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest(path.build.css))
      .pipe(browserSync.stream());
});

gulp.task('js', function () {
  return browserify(path.src.js.self, {debug: !isProduction})
      .transform(babelify, {
        presets: ['es2015']
      })
      .bundle()
      .on('error', function (err) {
        /* eslint-disable */
        console.log(err.toString());
        this.emit('end');
        /* eslint-enable */
      })
      .pipe(source('script.js'))
      .pipe(gulp.dest(path.build.js))
      .pipe(buffer())
      .pipe(gulpIf(isProduction, uglify()))
      .pipe(rename('script.min.js'))
      .pipe(gulp.dest(path.build.js))
      .pipe(browserSync.reload({
        stream: true
      }));
});

gulp.task('serve', function () {
  browserSync.init({
    server: './' + BUILD_FOLDER,
    notify: false,
    open: false,
    ui: false
  });

  gulp.watch([path.src.pug.pages, path.src.pug.blocks], ['html']);
  gulp.watch([path.src.sass.self, path.src.sass.blocks, path.src.sass.folder], ['style']);
  gulp.watch([path.src.js.self, path.src.js.blocks, path.src.js.folder], ['js']);
  gulp.watch(path.src.images.root, ['copy']);
});

gulp.task('imagemin', function () {
  return gulp.src(path.src.images.folder)
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true})
      ], {verbose: true}))
      .pipe(gulp.dest(path.src.images.self));
});

gulp.task('svgmin', function () {
  return gulp.src(path.src.images.svg)
      .pipe(svgo())
      .pipe(gulp.dest(path.src.images.self));
});

gulp.task('svgsprite', function () {
  return gulp.src(path.src.images.sprite)
      .pipe(svgstore({
        inlineSvg: true
      }))
      .pipe(rename('sprite.svg'))
      .pipe(gulp.dest(path.src.images.self));
});

gulp.task('clean', function () {
  return del(BUILD_FOLDER);
});

gulp.task('copy', function () {
  return gulp.src([
    path.src.fonts.folder,
    path.src.images.root,
    path.src.images.favicons,
    path.src.robots
  ], {base: SRC_FOLDER})
      .pipe(gulp.dest(BUILD_FOLDER));
});

gulp.task('build', function (fn) {
  runSequence('clean', 'copy', 'html', 'style', 'js', fn);
});
