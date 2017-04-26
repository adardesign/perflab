var gulp = require('gulp');



// Development Tasks 
// -----------------

gulp.task('copy-client-npm', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
});
