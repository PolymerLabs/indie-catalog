'use strict';

const bower = require('gulp-bower');
const del = require('del');
const fs = require('fs');
const git = require('gulp-git');
const gulp = require('gulp');
const runSequence = require('run-sequence');
let run = require('gulp-run');

// Analyzer stuff.
const {Analyzer, generateAnalysis} = require('polymer-analyzer');
const FSUrlLoader = require('polymer-analyzer/lib/url-loader/fs-url-loader').FSUrlLoader;
const PackageUrlResolver = require('polymer-analyzer/lib/url-loader/package-url-resolver').PackageUrlResolver;

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

gulp.task('clean', function() {
  return del([__dirname + '/dist']);
});

let repos = [];

gulp.task('make-dist', function() {
  let json = JSON.parse(fs.readFileSync(__dirname + '/catalog.json'));
  let packages = json.packages;

  for (var repo in packages) {
    // The plan: copy all the elements and their deps into `/dist`.
    let path = __dirname + '/dist/' + repo;

    let repoName = repo;  // save this for later because loops.
    repos.push(path);     // save this for later to run bower on.

    // Skip this bit if there's nothing to clone.
    if (!packages[repo].git) {
      continue;
    }

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

      // Step 3. Read the main field from bower.
      let bowerjson = JSON.parse(fs.readFileSync(path + '/bower.json'));
      let inputs = [].concat(bowerjson.main);

      // Step 4. bower install the element's dependencies.]
      // TODO: move this to its own task.
      console.log('Running bower install in ' + path);
      bower({cwd: path, verbosity: 1}).on('end', function() {
        // Step 5. Copy the element in its bower_components, so that
        // the demo works.
        gulp.src(path + '/**').pipe(gulp.dest(`${path}/bower_components/${repoName}`));

        // Step 6. Run analyzer.
        let analyzerRoot = 'dist/' + repoName + '/';
        const analyzer = new Analyzer({
          urlLoader: new FSUrlLoader(analyzerRoot),
          urlResolver: new PackageUrlResolver(),
        });

        // const isInPackage = feature => feature.sourceRange != null &&
        //   feature.sourceRange.file.startsWith(path.basename(root));

        if (inputs == null || inputs.length === 0) {
          console.log('got nothing to analyze');
          // TODO: fall back to package analysis
        } else {
          analyzer.analyze(inputs).then(function(analysis) {
            var blob = JSON.stringify(generateAnalysis(analysis, analyzerRoot));
            fs.writeFileSync(path + '/descriptor.json', blob);

            let docsFile =
`
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes">
  <title>${repoName}</title>
  <link rel="import" href="../../bower_components/iron-ajax/iron-ajax.html">
  <link rel="import" href="../../bower_components/iron-doc-viewer/iron-doc-viewer.html">
  <link rel="import" href="../../bower_components/iron-doc-viewer/default-theme.html">
  <link rel="import" href="../../bower_components/polymer/lib/elements/custom-style.html">
  <link rel="import" href="../../bower_components/polymer/lib/elements/dom-bind.html">
  <script src="../../bower_components/webcomponentsjs/webcomponents-loader.js"></script>
  <custom-style>
    <style is="custom-style" include="iron-doc-default-theme"></style>
  </custom-style>
</head>
<body>
  <dom-bind>
    <template>
      <iron-ajax auto url="./descriptor.json" last-response="{{response}}" handle-as="json"></iron-ajax>
      <iron-doc-viewer descriptor="[[response]]"></iron-doc-viewer>
    </template>
  </dom-bind>
</body>
</html>
`;
            fs.writeFileSync(path + '/docs.html', docsFile);
          }).catch(function(error) {
            console.log(error);
          });
        }

      });
    });
  }
});

gulp.task('polymer-build', function() {
  return run('polymer build').exec();
});

gulp.task('copy-dist-to-build', function() {
  gulp.src(__dirname + '/dist/**/*').pipe(gulp.dest(`${__dirname}/build/es6-bundled/dist/`));
});

gulp.task('default', function(done) {
  runSequence('clean', 'make-dist', 'polymer-build', 'copy-dist-to-build');
});

// Note: this assume your local 'dist' folder is ok (you've ran make-dist in the past)
gulp.task('debug', function(done) {
  runSequence('polymer-build', 'copy-dist-to-build');
});
