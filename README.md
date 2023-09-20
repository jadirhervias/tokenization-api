# Tokenization API

## Features

- [Node/NPM](https://nodejs.org/es) (18.14.0/9.4.2)
- [TypeScript](https://www.typescriptlang.org/) (v5)
- [ts-node-dev](https://github.com/wclr/ts-node-dev)
- [Serverless Framework](https://www.serverless.com/)
- [Docker Compose](https://docs.docker.com/compose/gettingstarted/) (v3)
- [Jest](https://jestjs.io)

## Project setup

```
# Once located in the root of the project (copy content of '.env.example' file to '.env' file)
cp .env.example .env

# install dependencies
npm install
npm install -g serverless

# start postgres and redis
docker-compose up

# generate deploy build
npm run build
```

## Run
```
# run API locally
npm run dev

# run lambda locally
npm run build && npm run start
```

## Test with Jest and supertest
```
npm run test
```
