# nuxt-app

Nuxt.js アプリ開発練習

## Environment

- OS:
    - Ubuntu 20.04
- Docker: 19.03.12
    - docker-compose: 1.26.0

### Setup
```bash
# add execution permission to ./n
$ chmod +x ./n

# setup and start docker containers
## node command: service://cli in localhost network
## mongodb server: service://db:27017 => http://localhost:27017
## mongodb express server: service://admin:8081 => http://localhost:8081
$ export UID && docker-compose build
$ docker-compose up -d

# create nuxt project => ./app/
## $ docker-compose run node npx create-nuxt-app app
$ ./n npx create-nuxt-app app
## Project name: app
## Programming language: JavaScript
## Package manager: Npm
## UI framework: Buefy
## Nuxt.js modules: Axios
## Linting tools: ESLint
## Testing framework: None
## Rendering mode: Universal (SSR / SSG)
## Deployment target: Server (Node.js hosting)
## Development tools: jsconfig.json

# remove app .git
$ rm -rf app/.git

# start nodejs server
## $ docker-compose exec -w /work/app/ cli yarn dev
$ opt='-w /work/app/' ./n yarn dev

# => Listening on: http://localhost:3000 => service://node:3000
```

![buefy-nuxt-start.png](./img/buefy-nuxt-start.png)

***

## Tests

### MongoDB from Node.js
```bash
# install node_packages: mongodb
$ opt='-w /work/tests/' ./n yarn add mongodb

# execute node ./tests/mongodb.js
$ opt='-w /work/tests/' ./n node mongodb.js

connected
Inserted 3 documents into the collection
{
  result: { ok: 1, n: 3 },
  ops: [
    { a: 1, _id: 5f2add9fd472a97a35c46942 },
    { b: 2, _id: 5f2add9fd472a95424c46943 },
    { c: 3, _id: 5f2add9fd472a97e8ec46944 }
  ],
  insertedCount: 3,
  insertedIds: {
    '0': 5f2add9fd472a97a35c46942,
    '1': 5f2add9fd472a95424c46943,
    '2': 5f2add9fd472a97e8ec46944
  }
}
```

http://localhost:8081/db/myDB/documents

![mongodb.png](./tests/img/mongodb.png)
