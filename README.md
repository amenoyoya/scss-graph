# nuxt-app

Nuxt.js アプリ開発練習

## Environment

- OS:
    - Ubuntu 20.04
- anyenv: 1.1.1
    - nodenv: 1.3.2
        - Node.js: 12.18.2
        - yarn: 1.22.4

### Setup
```bash
# move to project directory
$ cd app

# install node_packages
$ yarn install

# start development server
$ yarn dev

# => Listening on: http://localhost:3000
```

![buefy-nuxt-start.png](./img/buefy-nuxt-start.png)

#### Setup detail (Remarks)
```bash
# install nodejs 12.18.2 by nodenv
## nodenv: with nodenv-yarn-install plugin
$ touch $(nodenv root)/default-packages
$ noenv install 12.18.2

# switch 12.18.2
$ nodenv global 12.18.2

# update package manager
$ npm install -g npm

# create nuxt project => ./app/
$ npx create-nuxt-app app
## Project name: slack-clone
## Programming language: JavaScript
## Package manager: Yarn
## UI framework: Buefy
## Nuxt.js modules: axios
## Linting tools: ESLint
## Testing framework: None
## Rendering mode: Universal (SSR / SSG)
## Deployment target: Static (Static/JAMStack hosting)
## Development tools: jsconfig.json

# remove app .git
$ rm -rf app/.git
```
