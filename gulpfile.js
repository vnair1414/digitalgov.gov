var child = require('child_process');
var gutil = require('gulp-util');
var gulp = require('gulp');
var notify = require("gulp-notify");

var sass = require('gulp-sass'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
		rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    combineMq = require('gulp-combine-mq'),
    strip = require('gulp-strip-css-comments'),
    size = require('gulp-size'),
    responsive = require('gulp-responsive'),
    browserSync = require('browser-sync').create();

var supportedBrowsers = [
  	'> 1%',
  	'Last 2 versions',
  	'IE 11',
  	'IE 10',
  	'IE 9',
];

var paths = {
  scss: '_sass/main.scss',
  scssDestination: 'assets/css',
  scssSiteDestination: '_site/assets/css',
  js: 'assets/js/main.js',
};

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: 'Rebuilding incrementally...',
    jekyllBuildComplete: 'Rebuilding complete site...'
};

const siteRoot = '_site';

gulp.task('build-images', function () {
  return gulp.src('assets/img/_to-process/*.{png,jpg}')
    .pipe(gulp.dest('_site/assets/img/raw'))
    .pipe(gulp.dest('assets/img/raw'))
    .pipe(responsive({
      '*': [{
        // image-xs.jpg is 200 pixels wide
        width: 200,
        rename: {
          suffix: '-200w',
          extname: '.jpg',
        },
      }, {
        // image-400w.jpg is 400 pixels wide
        width: 400,
        rename: {
          suffix: '-400w',
          extname: '.jpg',
        },
        withoutEnlargement: true,
      }, {
        // image-600w.jpg is 800 pixels wide
        width: 600,
        rename: {
          suffix: '-600w',
          extname: '.jpg',
        },
        withoutEnlargement: true,
      }, {
        // image-md.jpg is 600 pixels wide
        width: 800,
        rename: {
          suffix: '-800w',
          extname: '.jpg',
        },
        withoutEnlargement: true,
      }, {
        // image-1200w.jpg is 1200 pixels wide
        width: 1200,
        rename: {
          suffix: '-1200w',
          extname: '.jpg',
        },
        withoutEnlargement: true,
      }, {
        // image-1600w.jpg is 600 pixels wide
        width: 1600,
        rename: {
          suffix: '-1600w',
          extname: '.jpg',
        },
        withoutEnlargement: true,
      }, {
        // image-2400w.jpg is 1200 pixels wide
        width: 2400,
        rename: {
          suffix: '-2400w',
          extname: '.jpg',
        },
        withoutEnlargement: true,
      }, {
        // image-200w.webp is 200 pixels wide
        width: 200,
        rename: {
          suffix: '-200w',
          extname: '.webp',
        },
      }, {
        // image-400w.webp is 400 pixels wide
        width: 400,
        rename: {
          suffix: '-400w',
          extname: '.webp',
        },
        withoutEnlargement: true,
      }, {
        // image-600w.webp is 400 pixels wide
        width: 600,
        rename: {
          suffix: '-600w',
          extname: '.webp',
        },
        withoutEnlargement: true,
      }, {
        // image-800w.webp is 400 pixels wide
        width: 800,
        rename: {
          suffix: '-800w',
          extname: '.webp',
        },
        withoutEnlargement: true,
      }, {
        // image-1200w.webp is 400 pixels wide
        width: 1200,
        rename: {
          suffix: '-1200w',
          extname: '.webp',
        },
        withoutEnlargement: true,
      }, {
        // image-1600w.webp is 400 pixels wide
        width: 1600,
        rename: {
          suffix: '-1600w',
          extname: '.webp',
        },
        withoutEnlargement: true,
      }, {
        // image-1600w.webp is 400 pixels wide
        width: 2400,
        rename: {
          suffix: '-2400w',
          extname: '.webp',
        },
        withoutEnlargement: true,
      }],
    }, {
      // Global configuration for all images
      // The output quality for JPEG, WebP and TIFF output formats
      quality: 80,
      // Use progressive (interlace) scan for JPEG and PNG output
      progressive: true,
      // Strip all metadata
      withMetadata: false,
      // Do not emit the error when image is enlarged.
      errorOnEnlargement: false,
      errorOnUnusedConfig: false,
      silent: true,
    }))
    .pipe(gulp.dest('_site/assets/img/dist'))
    .pipe(gulp.dest('assets/img/dist'));
});

gulp.task('img', ['build-images'], function () {
  return del([
    'assets/img/_to-process/*'
  ]);
});

gulp.task('img-notify', ['img'], function () {
  return gulp.src("/")
    .pipe(notify({
      "title": "digital.gov",
      "subtitle": "Responsive images built.",
      "message": "Project reloaded.",
      "sound": "Pop" // case sensitive
    }))
    .pipe(browserSync.stream());
});

gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return child.spawn( jekyll , ['build', '--incremental', '--drafts'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-build-complete', function (done) {
    browserSync.notify(messages.jekyllBuildComplete);
    return child.spawn( jekyll , ['build', '--drafts'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  return gulp.src("/")
    .pipe(notify({
      "title": "digital.gov",
      "subtitle": "Incremental build finished.",
      "message": "Project reloaded.",
      "sound": "Pop" // case sensitive
    }))
    .pipe(browserSync.stream());
});

gulp.task('jekyll-rebuild-complete', ['jekyll-build-complete'], function () {
  return gulp.src("/")
    .pipe(notify({
      "title": "digital.gov",
      "subtitle": "Complete build finished.",
      "message": "Project reloaded.",
      "sound": "Pop" // case sensitive
    }))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['jekyll-build-complete'], function() {
  browserSync.init({
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
});

gulp.task('jekyll-first-build', ['serve'], function () {
  return gulp.src("/")
    .pipe(notify({
      "title": "digital.gov",
      "subtitle": "Initial build finished.",
      "message": "Project loaded at localhost:4000.",
      "sound": "Pop" // case sensitive
    }))
    .pipe(browserSync.stream());
});

gulp.task('sass', function(){
  return gulp.src(paths.scss)
    .pipe(sass({
        outputStyle: 'compact',
        errLogToConsole: true,
        quiet: true,
    }).on('error', sass.logError))
    .pipe(strip())
    .pipe(
      autoprefixer({
        browsers: supportedBrowsers,
        cascade: false,
      })
    )
    .pipe(combineMq({
        beautify: true
    }))
    .pipe(cleanCSS({
      compatibility: 'ie8',
      level: 2,
    }))
    .pipe(rename('main.css'))
    .pipe(gulp.dest(paths.scssDestination))
    .pipe(gulp.dest(paths.scssSiteDestination))
    .pipe(size())
    .pipe(browserSync.stream())
    .pipe(notify({
      "title": "digital.gov",
      "subtitle": "/css/main.css compiled.",
      "message": "Project loaded at localhost:4000.",
      "sound": "Pop" // case sensitive
    }));
 });

// // Gulp watch
// gulp.task('watch', function(){
//   gulp.watch('assets/scss/*.scss', ['sass']);
//   gulp.watch('assets/scss/*/*.scss', ['sass']);
//   gulp.watch('assets/js/*.js', ['jshint']);
// })

gulp.task('watch', function () {
    gulp.watch('_sass/**/*', ['sass']);
    gulp.watch([
      '_includes/**/*',
      '_layouts/**/*',
      '_posts/**/*',
      'content/**/*'
    ], ['jekyll-rebuild']);
    gulp.watch([
      '_data/**/*'
    ], ['jekyll-rebuild-complete']);
    gulp.watch([
      'assets/img/_to-processx/**/*',
    ], ['img-notify']);
});

gulp.task('default', ['jekyll-first-build', 'img-notify', 'sass', 'watch']);
