FROM node:alpine

WORKDIR /
RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

COPY . .

# Install packages
RUN yarn
RUN yarn run lint
RUN yarn run compile
CMD yarn start