FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN yarn install
RUN yarn run build

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000