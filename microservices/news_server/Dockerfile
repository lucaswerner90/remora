FROM node:alpine

WORKDIR /
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

COPY package.json package.json

# Install packages
RUN yarn

COPY . .

RUN yarn run lint
RUN yarn run compile
CMD yarn start