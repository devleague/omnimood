var gulp = require('gulp');
var sass = require('gulp-sass');

var PathTo = {
  SassFiles: './sass/**/*.scss',
  PublicFolder: './public',
  PublicCss: './public/css',
  PublicCssFiles: './public/css/*.css'
};

gulp.task('watch-files', function () {
  gulp.watch(PathTo.SassFiles, ['compile-sass']);
});

gulp.task('compile-sass', function () {
  return gulp
          .src(PathTo.SassFiles, ['compile-sass'])
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest(PathTo.PublicCss));
});

gulp.task('default', ['compile-sass', 'watch-files']);