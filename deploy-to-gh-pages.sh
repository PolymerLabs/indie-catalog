#!/bin/bash -e

# Based on https://github.com/Polymer/tools/blob/master/bin/gp.sh

# This script pushes a demo-friendly version of your element and its
# dependencies to gh-pages.

# Run in a clean directory passing in a GitHub org and repo name
org="polymerlabs"
repo="indie-catalog"
#branch="master" # default to master when branch isn't specified

# make folder (same as input, no checking!)
mkdir $repo
git clone https://github.com/$org/$repo.git --single-branch

# switch to gh-pages branch
pushd $repo >/dev/null
git checkout --orphan gh-pages

# remove the .gitignore since we're going to be pushing deps
git rm -rf ./.gitignore
git rm -rf ./node_modules
git rm -rf ./dist
git rm -rf ./build
git rm -rf ./bower_components

# use bower to install runtime deployment
bower cache clean # ensure we're getting the latest from the desired branch.

# copy the bower.json from master here
# git show ${branch}:bower.json > bower.json

# install the bower deps and also this repo so we can copy the demo
bower install && gulp

# copy the build output over
echo "copying things over..."
cp -R build/es6-bundled/* .

# send it all to github
git add -A .
git commit -am 'seed gh-pages'
git push -u origin gh-pages --force

popd >/dev/null
