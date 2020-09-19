#!/usr/bin/env bash
THISDIR=$(cd $(dirname "$0"); pwd) #this script's directory
echo "current dir is: $PWD"
pushd .
cd $THISDIR
echo "current dir is now: $PWD"

# go to package dir & build package
cd ..
echo "current dir should be package dir. Is: $PWD"
npm i
npm run build
# now that package is built, return to example dir and build example
cd $THISDIR
echo "current dir should be example dir. Is: $PWD"
# first replace a placeholder in the example file with the current commit value:
echo "NOW_GITHUB_COMMIT_SHA: $NOW_GITHUB_COMMIT_SHA"
if [ -n "$NOW_GITHUB_COMMIT_SHA" ]; then
  sed -i -e "s/COMMIT_SHA/$NOW_GITHUB_COMMIT_SHA/g" ./dist/index.html
fi
# now build the example:
npm i
npm run build

# return to root/package dir
cd ..
echo "all built. current dir should be package dir. Is: $PWD"
# trigger build