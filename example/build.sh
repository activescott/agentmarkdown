#!/usr/bin/env bash
THISDIR=$(cd $(dirname "$0"); pwd) #this script's directory
echo "current dir is: $PWD"
pushd .
cd $THISDIR
echo "current dir is now: $PWD"

pushd .
cd ..
yarn build
popd
yarn
yarn build
popd .