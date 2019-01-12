FROM node:alpine

WORKDIR /
RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

COPY . .

RUN yarn
RUN yarn run build
CMD NODE_ENV=production && yarn run prod