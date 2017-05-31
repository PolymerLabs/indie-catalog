'use strict';

let gulp = require('gulp');
let fs = require('fs');
let del = require('del');
let runSequence = require('run-sequence');
let git = require('gulp-git');
let bower = require('gulp-bower');

gulp.task('clean', function() {
  return del(['dist']);
});

let repos = [];

gulp.task('checkout', function() {
  let json = JSON.parse(fs.readFileSync(__dirname + '/catalog.json'));
  let packages = json.packages;
  for (var repo in packages) {
    let path = __dirname + '/dist/' + repo;
    let repoName = repo;
    repos.push(path);

    // Step 1. Clone the element.
    git.clone(packages[repo].git, {args: '--depth 1 -- ' + path}, function (err) {
      if (err) {
        console.log(err);
        return;
      }

      // Step 2. Delete the .git from it. Be very careful not to
      // Delete your own .git repo 🙄.
      del([path + '/.git']);
      del([path + '/.gitignore']);

      // Step 3. bower install the element's dependencies.
      console.log('Running bower install in ' + path);
      bower({cwd: path, verbosity: 1}).on('end', function() {
        // Step 4. Copy the element in its bower_components, so that
        // the demo works.
        gulp.src(path + '/**').pipe(gulp.dest(`${path}/bower_components/${repoName}`));g
      });
    });
  }
});

// This does't work
// gulp.task('bower-old', function() {
//   for (var i = 0; i < repos.length; i++) {
//     bower({directory: repos[i] + '/bower_components', cwd: repos[i], verbosity: 2});
//   }
// });

// And this isn't ready yet
gulp.task('bower', function() {
  console.log('sigh');
});

gulp.task('default', function(done) {
  runSequence('clean', 'checkout', 'bower');
});
