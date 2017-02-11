#!/bin/sh

BASEIMG="mhart/alpine-node:base-7"
CONTAINER=treecom/tollot
TAG=latest
REGISTRY=docker-registry.treecom.net:5000
BASENAME=`basename $PWD`
BUILD_DIR=`pwd`/.build
WORKDIR=$PWD

echo "Start building container ${CONTAINER} ..."

# install dev dependencies
rm -rf node_modules &&
npm install --production &&

## Build docker image ##

# pull fresh base image:
docker pull ${BASEIMG} &&
# build container
docker build --rm -t ${CONTAINER}:${TAG} . &&
# create tag on container
docker tag ${CONTAINER}:${TAG} ${REGISTRY}/${CONTAINER}:${TAG} &&
# push to our registry
docker push ${REGISTRY}/${CONTAINER}:${TAG} &&
# clean images
docker rmi -f ${CONTAINER}:${TAG} ${REGISTRY}/${CONTAINER}:${TAG} ${BASEIMG}


# clean build folder
rm -rf $BUILD_DIR

echo "End build of container ${CONTAINER} ..."
