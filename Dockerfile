FROM mhart/alpine-node:base-7
MAINTAINER Martin Bucko <bucko@treecom.net>

ENV NODE_ENV=production

ADD ./ .

# If you have native dependencies, you'll need extra tools
#RUN apk add --no-cache make gcc g++ python

# If you need npm, don't use a base tag
#RUN npm install --production

EXPOSE 80
CMD ["node", "server.js"]
