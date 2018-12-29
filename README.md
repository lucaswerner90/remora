# REMORA

## Introduction

Rémora is an upcoming application that will allow the users to be able to detect "whale orders" within the different exchanges (such as Binance, GDAX, etc.) through a simple interface.

Besides that, we're planning to add more advanced features, as a prediction system (using artificial intelligence), or a News service, that will send the user the latest published news about the Bitcoin ecosystem.

## Trello Board

You need access to get there, request one first.

https://trello.com/b/GgS6zN0O/tasks


## Technologies used in Rémora

REMORA uses a number of open source projects to work properly (and we try to be up to date on this side):

* [Redis](https://redis.io)
* [Nginx](https://www.nginx.com/)
* [Docker](https://www.docker.com/)
* [Docker Compose](https://www.docker.com/)
* [Socket IO](https://socket.io/)
* [NodeJS](https://nodejs.org/es/)
* [TypeScript](https://www.typescriptlang.org/)
* [TSLint](https://palantir.github.io/tslint/)
* [Yarn](https://yarnpkg.com/)
* [React](https://reactjs.org/)

## Development

Our idea is to be able to develop as fast as possible (but with high quality of course).

In order to execute a simple version of the project you just need to use the docker-compose-dev file and the following command:

```sh
# Run development environment using docker-compose-dev.yml file
docker-compose -f docker-compose-dev.yml up --build
```

This command will compile every microservice and execute it directly into your computer.

If you want to run the **production environment** you just need to run the following command (but this is not recommended, as NGINX needs to listen the 80 port and you would need superuser rights to do so):

```sh
# Run the docker-compose.yml file to simulate the real environment
docker-compose up --build
```

Additionally you can create your own docker-compose file for dev purposses (we already have the docker-compose-dev.yml file for this), in this case you should specify which file you want to run using the following command:

```sh
docker-compose -f <new-docker-compose-file> up --build
```

To be able to restart only one component/container:

```sh
docker-compose -f docker-compose-dev.yml restart <container_name>
```

If you do some modifications within a Dockerfile or you modify the docker-compose-dev.yml file you need to build the image again:

```sh
docker-compose [-f <docker-compose-file>] build <container_name>
docker-compose restart <container_name>
```

Some other useful commands for Docker:
```sh
# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
docker rmi $(docker images -q)
```

For productions or for a more realistic builds of the project, docker-swarm is used (but don't worry, it's not necessary):

```sh
docker swarm init
docker-compose -f <docker-compose-file> push
docker stack deploy --compose-file <docker-compose-file> remora
```
### Run only an exchange server
In order to improve the time of development, you can run a simple docker-compose file and run an exchange server in development mode.

The docker-compose-dev file should look like this:

```sh
version: "3"

services:

  socketio_1:
    build: ./socketio
    hostname: socketio_1
    restart: always
    environment:
      - PORT=4500
      - REDIS_HOST=redis
    depends_on: 
      - redis

  redis:
    build: ./redis
    hostname: redis
    restart: always
    ports: 
    - "6379:6379"

```
So you're only running Redis and SocketIO which are the components needed for the exchange server to run.

Now, you can run:

```sh
yarn run start-dev
```

This will run the nodemon package directly from TypeScript. You can compile the code as usual ( using the "compile" or "compile-live" task) before running the server if you want. The default configuration will be taken if you don't specify any.

### Microservices development

If you will develop the fantastic and fancies Rémora's microservices, you need to know a couple of things first. So please, **PAY ATTENTION**.

#### Microservice's folder structure
Every microservice has its own folder in the root folder, and it MUST be like this.


The **basic structure** contains the following folders and files:

* src/
* test/
* Dockerfile
* package.json
* tsconfig.json
* tslint.json

The **src** folder contains the microservice's source code. We use Typescript as our main language for the development as it provides static check typing and it helps like a lot! :D

The **test** folder contains all the necessary tests that will check our code. Right now, we're using Mocha for it.

The **Dockerfile** contains the orders that will be executed in order to compile the microservice (I'll explain that later).

The **package.json** contains all the necessary NPM packages to develop and execute the microservice. This should be the basic content for it:

```sh
{
  "name": "microservicename",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
  },
  "devDependencies": {
    "@types/chai": "^4.1.6",
    "@types/mocha": "^5.2.5",
    "@types/node": "^10.11.7",
    "@types/redis": "^2.8.7",
    "chai": "^4.2.0",
    "mocha": "^5.2.0",
    "ts-node": "^7.0.1",
    "tsc": "^1.20150623.0",
    "tslint": "^5.11.0",
    "tslint-config-airbnb": "^5.11.0",
    "typescript": "^2.8.3"
  },
  "scripts": {
    "start": "node ./dist/index.js",
    "lint": "./node_modules/.bin/tslint -p tsconfig.json",
    "compile": "./node_modules/.bin/tsc",
    "compile-live": "./node_modules/.bin/tsc --watch"
  }
}

```

As you can see, the **start** command (within the scripts section) launches the microservice. In order to continue with this convention, you should start your new microservice with this file.

The **tsconfig.json** controls the Typescript compilation (don't touch it):

```sh
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "outDir": "dist",
    "resolveJsonModule": true
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules" 
  ]
}
```

The **tslint.json** contains:

```sh
{
    "defaultSeverity": "error",
    "jsRules": {},
    "rules": {
        "align": false,
        "indent": [true, "spaces", 2],
        "max-line-length": false,
        "no-unused-variable": true,
        "member-ordering": false,
        "variable-name": false,
        "function-name": false,
        "no-increment-decrement": false,
        "radix": false
    },
    "extends": "tslint-config-airbnb"
}
```

And...the key here is the **Dockerfile**:

```docker
# Use the latest node:alpine image
FROM node:alpine

WORKDIR /
RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

# Copy the directory content
COPY . .

# Install the packages
RUN yarn

# Run tslint to look for possible type errors
RUN yarn run lint

# Compile the directory that contains the TypeScript files
# and creates the dist directory
RUN yarn run compile

# Executes the microservice
CMD yarn start
```

So...let's say that you did some changes...before pushing to git...check that everything is correct:

* Install the packages
```sh
yarn start
```

* Check the lint rules
```sh
yarn run lint
```

* Check the compilation
```sh
# You can run `yarn run compile-live` for live updates in the compilation process.
yarn run compile
```

* And run the program
```sh
# You can run `yarn run compile-live` for live updates in the compilation process.
yarn start
```

You can do all this steps all at once if you run:


```sh
docker-compose -f docker-compose-dev.yml build <container_name>
docker-compose -f docker-compose-dev.yml restart <container_name>
```


### Useful videos to understand a few concepts/technologies of the project
* Docker Swarm:
    * https://www.youtube.com/watch?v=m6WgX_LBtEk
    * https://github.com/tsmean/docker-tutorial/tree/master/4_docker-swarm-and-stack


## Continuous Development / Continuous integration

Honestly, nobody wants to reset the servers everytime we need to update the application, and we know that, so in order to be able to provide a simple pipeline for all developers there's a file that does all that magic for us:

[Link to the Pipelines section in Gitlab](https://gitlab.com/lucaswerner90/REMORA/pipelines)

```sh
#.gitlab-ci.yml file manages all the required steps for CI/CD

image: docker:latest

services:
  - docker:dind

stages:
  - test
  - deploy

test:
  stage: test
  tags:
    - docker
  only:
    - develop
    - production
  script:
    - docker-compose build
    
step-deploy-production:
  stage: deploy
  only:
    - production
  script:
    - docker-compose down
    - docker-compose up -d
  tags:
    - production
  when: manual

```
Ok, what is that? Let's explain it step by step:

```sh
# please, use the latest docker image to be able to push all the code into our servers
image: docker:latest

#define the DockerInDocker service for GitlabCI
services:
  - docker:dind

# Now, we only have 2 steps, simple but powerful. The first one checks that everything is going to work fine. So, for every container (microservice), we build it, and if everything goes as expected...chan chan! We move to the next one!
# Deploy spreads our changes into our servers (and we'd really appreciate that)
stages:
  - test
  - deploy
```

Test step:
```sh
# First of all, the step will be running ONLY for the "develop" and "production" git branches. So if you modify something in your branch, this won't have any effect as it won't be fired.
test:
  stage: test
  tags:
    - docker
  only:
    - develop
    - production
  script:
    # Simple, compile every container 
    # and check that we did it good in our changes
    - docker-compose build
    
```

Deploy step:

```sh
# As we said before, if everything went well during the test step, we're ready to run the deploy.

step-deploy-production:
  stage: deploy
  only:
    # This line create a condition, the changes need to be included in the "production" branch, otherwise, it won't run at all (it's better doing it like this, truste me)
    - production
  script:
    # Shut down the current Docker services
    - docker-compose down
    # Run them again! Let's rock!
    - docker-compose up -d
  tags:
    - production
  # And, finally...this step can ONLY be executed if we do it manually (there'sa
  # button in the Pipeline section, you don't need to it strictly manually ok? )
  when: manual
```

## Upcoming Features

Always thinking about new features besides our current product. These are some of them:

* **Impact of new detected orders using AI algorithm**: let's say that a previous order similar to the new one made the price of the coin to be increased, with an impact of the 1% of it, 10 minutes later thiat order has appeared. We can code a RNN or a simple prediction algorithm to make this, and classify the orders even before they're executed.

* **Possibility to send WhatsApp / SMS notifications to paid users**: This can be applied to extra step verification and also for the "premium" users to receive notifications about the movements of the coins

* **News about the coins**: The server for it has already been implemented (see newsserver folder). The idea is to be able to notify the users about possible changes in price based on news headlines, i.e. a bank wants to invest in a specific coin.

## Authors

* [Lucas Werner](https://www.linkedin.com/in/lucas-werner/)
* [Sergio Amor](https://www.linkedin.com/in/sergioamor/)