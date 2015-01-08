var gulp = require('gulp');
var concat = require('gulp-concat');
var to5 = require('gulp-6to5');

/**
 * converts javascript to es5.
 */
gulp.task('to5', function () {
	try {
		return gulp.src([
				'./node_modules/observe-shim/lib/observe-shim.js',
				'./mvc.js'
			])
			.pipe(concat('mvc.js'))
			.pipe(to5({
					modules: 'amd'
				}).on('error', function(e) {
					console.log('error running 6to5', e);
				})
			)
			.pipe(gulp.dest('./dist/'));
	}  catch(e) {
		console.log('Got error in 6to5', e);
	}
});

gulp.task('default', ['to5']);
