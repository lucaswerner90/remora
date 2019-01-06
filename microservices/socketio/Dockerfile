FROM node:alpine

WORKDIR /
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
COPY . .

# Install packages
RUN yarn
RUN yarn run lint
RUN yarn run compile
CMD yarn start