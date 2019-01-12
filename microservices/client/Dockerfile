FROM node:alpine

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . /opt/app

RUN npm install
RUN npm run build
CMD NODE_ENV=production && npm run prod