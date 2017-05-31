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
    
    git.clone(packages[repo].git, {args: path}, function (err) {
      if (err) {
        console.log(err);
      }
      console.log('Running bower install in ' + path);
      bower({cwd: path, verbosity: 1}).on('end', function() {
        // Copy the element in the bower_components, so the demo works.
        gulp.src(path + '/**').pipe(gulp.dest(`${path}/bower_components/${repoName}`));
      });
    });
  }
});

gulp.task('bower-old', function() {
  for (var i = 0; i < repos.length; i++) {
    bower({directory: repos[i] + '/bower_components', cwd: repos[i], verbosity: 2});
  }
});

gulp.task('bower', function() {
  console.log('sigh');
});

gulp.task('default', function(done) {
  runSequence('clean', 'checkout', 'bower');
});
