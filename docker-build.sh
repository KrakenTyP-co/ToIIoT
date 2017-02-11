#!/bin/sh

BASEIMG="mhart/alpine-node:base-7"
CONTAINER=treecom/tollot
TAG=latest
REGISTRY=docker-registry.treecom.net:5000
BASENAME=`basename $PWD`
BUILD_DIR=`pwd`/.build
WORKDIR=$PWD

echo "Start building container ${CONTAINER} ..."


#rm -rf node_modules &&
#npm install && # do it self developer
npm run clean &&
npm run build-server &&
cp package.json ./dist
cp .env_production ./dist/.env
cp -r configs ./dist
cd dist
npm install --production &&
cd ..

## Build docker image ##

# pull fresh base image:
sudo docker pull ${BASEIMG} &&
# build container
sudo docker build --rm -t ${CONTAINER}:${TAG} . &&
# create tag on container
sudo docker tag ${CONTAINER}:${TAG} ${REGISTRY}/${CONTAINER}:${TAG} &&
# push to our registry
sudo docker push ${REGISTRY}/${CONTAINER}:${TAG} &&
# clean images
# docker rmi -f ${CONTAINER}:${TAG} ${REGISTRY}/${CONTAINER}:${TAG} ${BASEIMG}


# clean build folder
rm -rf $BUILD_DIR

echo "End build of container ${CONTAINER} ..."
