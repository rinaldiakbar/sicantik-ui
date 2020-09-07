'use strict';

var gulp = require('gulp');
var path = require('path');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function() {
    return gulp.src([
            paths.src + '/app/**/*.html',
            paths.tmp + '/app/**/*.html'
        ])
        .pipe($.if(function(file) {
                return $.match(file, ['!**/examples/*.html']);
            },
            $.minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            })))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'app',
            root: 'app'
        }))
        .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function() {
    var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: paths.tmp + '/partials',
        addRootSlash: false
    };

    var htmlFilter = $.filter(['*.html', '!/src/app/elements/examples/*.html'], { restore: true });
    var jsFilter = $.filter('**/*.js', { restore: true });
    var cssFilter = $.filter('**/*.css', { restore: true });

    return gulp.src(paths.tmp + '/serve/*.html')
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe($.useref())
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify({ preserveComments: $.uglifySaveLicense }))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore)
        .pipe($.replace('../bower_components/material-design-iconic-font/dist/fonts', '../fonts'))
        .pipe($.replace('../font/weathericons-regular', '../fonts/weathericons-regular'))
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(paths.dist + '/'))
        .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('images', function() {
    return gulp.src(paths.src + '/assets/images/**/*')
        .pipe(gulp.dest(paths.dist + '/assets/images/'));
});

gulp.task('assetsjs', function() {
    return gulp.src(paths.src + '/assets/js/**/*')
        .pipe(gulp.dest(paths.dist + '/assets/js/'))
        .pipe($.size());
});

gulp.task('assetscss', function() {
    return gulp.src(paths.src + '/assets/css/**/*')
        .pipe(gulp.dest(paths.dist + '/assets/css/'));
});

gulp.task('assetgfonts', function() {
    return gulp.src(paths.src + '/assets/css/g-fonts/**/*')
        .pipe(gulp.dest(paths.dist + '/assets/css/g-fonts'));
});

gulp.task('fonts', function() {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('leaflet-images', function () {
  return gulp.src(['bower_components/leaflet/dist/images/*', 'bower_components/Leaflet.awesome-markers/dist/images/*'])
      .pipe($.filter(['*.gif', '*.jpg', '*.png']))
      .pipe(gulp.dest(paths.dist + '/styles/images/'));
});

gulp.task('translations', function() {
    return gulp.src('src/**/il8n/*.json')
        .pipe(gulp.dest(paths.dist + '/'))
        .pipe($.size());
});

gulp.task('data', function() {
    return gulp.src('src/**/data/*.json')
        .pipe(gulp.dest(paths.dist + '/'))
        .pipe($.size());
});

gulp.task('examplejs', function() {
    return gulp.src('src/**/examples/*.{js,scss}')
        .pipe(gulp.dest(paths.dist + '/'))
        .pipe($.size());
});

gulp.task('misc', function() {
    return gulp.src(paths.src + '/*.{png,ico}')
        .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('protection', function() {
    gulp.src(paths.src + '/.htaccess').pipe(gulp.dest(paths.dist));
    return gulp.src(paths.src + '/robots.txt').pipe(gulp.dest(paths.dist));
});

gulp.task('clean', function() {
    return $.del([path.join(paths.dist, '/'), path.join(paths.tmp, '/')]);
});

gulp.task('buildapp', [
    'build-config', 'html', 'images', 'fonts', 'translations', 'misc', 'data',
    'examplejs', 'assetsjs', 'assetscss', 'assetgfonts', 'leaflet-images',
    'protection'
]);