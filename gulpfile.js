var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
    return gulp.src('./app/assets/sass/main.sass')
    .pipe(sass({ outputStyle: "compact" }).on('error', sass.logError))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7', { cascade: true }]))
    .pipe(gulp.dest('./app/assets/css'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
    return gulp.src('./app/*.html')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('js', function() {
    return gulp.src('./app/js/**/*.js')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './app'
        },
        notify: false
    });
});

gulp.task('build', function() {

    var buildCss = gulp.src([
        './app/assets/css/main.css',
    ])
    .pipe(gulp.dest('./dist/assets/css'));

    var buildJs = gulp.src('./app/js/*.js')
    .pipe(gulp.dest('./dist/js'));

    var buildHtml = gulp.src('./app/*.html')
    .pipe(gulp.dest('./dist'));

    var buildJson = gulp.src('./app/*.json')
    .pipe(gulp.dest('./dist'));

});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('img', function() {
    return gulp.src('./app/assets/img/**/*')
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('./dist/assets/img'));
});

gulp.task('watch', function() {
    gulp.watch('./app/assets/sass/**/*.sass', gulp.parallel('sass'));
    gulp.watch('./app/*.html', gulp.parallel('code'));
    gulp.watch('./app/js/**/*.js', gulp.parallel('js'));
});

gulp.task('buildproject', gulp.parallel('build', 'img',));

gulp.task('default', gulp.parallel('clean', 'browser-sync',
 'sass', 'code', 'js', 'watch'));