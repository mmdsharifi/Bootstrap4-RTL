var gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    rtlcss = require('rtlcss'),
    cssnano = require('cssnano'),
    notify = require("gulp-notify")
    bower = require('gulp-bower');

    var bootstrapPath ='./bower_components/bootstrap/scss';
    var fontawesomePath = './bower_components/font-awesome/scss';
    var config = {
        sassPath: './resources/sass',
        bowerDir: './bower_components'
    }
    // create a task to do bower install
gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

// Copy js files to public folder
gulp.task('js', function() {
    return gulp.src([config.bowerDir + '/bootstrap/dist/js/bootstrap.min.js',
            config.bowerDir + '/jquery/dist/jquery.min.js'
        ])
        .pipe(gulp.dest('./public/js'));
});

// Copy fontawesome icons to public/fonts folder
gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest('./public/fonts'));
});


gulp.task('css', function () {
        var processors = [
          cssnano,
          rtlcss
        ];
        // [].concat( bootstrapPath , fontawesomePath )
        return gulp.src(config.sassPath + '/style.scss')
          .pipe(sass({ includePaths : [bootstrapPath , fontawesomePath] }).on('error',  notify.onError(function (error) {
            return error.message;
          })))
          .pipe(postcss(processors))
          .pipe(rename({ suffix: '-rtl.alpha5.min' }))
          .pipe(gulp.dest('./public/css'))
          .pipe(notify("Sass files compiles successfuly!"));
});

// Add browserSync task
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './'
        }
    });
});

// Rerun the task when a file changes
// Run this task : gulp watch

gulp.task('watch', ['css', 'browserSync'], function() {
    gulp.watch(config.sassPath + '/**/*.scss', ['css']);
    browserSync.watch("./*.html").on("change", browserSync.reload); // browserSync watch task
});

// Run this task : gulp
// OR gulp default
gulp.task('default', ['bower', 'icons', 'css', 'js', 'watch']);
