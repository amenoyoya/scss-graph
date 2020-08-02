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

### Structure
```bash
./
|_ dist/ # コンパイル済み css, js, img 格納ディレクトリ
|   |_ img/
|   |_ css/
|   |   |_ (style.css) # webpackコンパイル後 css
|   |
|   |_ js/
|   |   |_ (app.js)    # webpackコンパイル後 js
|   |
|   |_ index.html # webpack-dev-server root: http://localhost:3000
|
|_ src/  # ソース scss, js, img 格納ディレクトリ
|   |_ img/
|   |_ js/
|   |   |_ app.jsx    # webpackソース js
|   |
|   |_ scss/
|       |_ style.scss # webpackソース scss
|
|_ package.json       # パッケージ設定等
|_ webpack.config.js  # webpack設定
```

#### webpack.config.js
```javascript
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = [
  {
    // ソースファイル: app.jsx, style.scss
    entry: {
      app: [
        './src/js/app.jsx',
        './src/scss/style.scss',
      ],
    },
    // コンパイル先
    output: {
      path: path.resolve(__dirname, 'dist'), // 絶対パス指定
      filename: 'js/[name].js',
      publicPath: '/',
    },
    // webpack-dev-server: http://localhost:3000 => ./dist/
    devServer: {
      contentBase: './dist',
      watchContentBase: true,
      port: 3000,
      open: true, // 自動的にブラウザ起動
    },
    // コンパイル設定
    module: {
      rules: [
        {
          // *.js, *.jsx => babel-loader でコンパイル
          test: /\.jsx?$/,
          exclude: /node_modules/, // node_modules を除外
          use: [
            {
              loader: 'babel-loader',
              options: {
                // @babel/preset-env, @babel/preset-react 構文拡張
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          ]
        },
        {
          // *.scss => sass-loader |> css-loader |> MiniCssExtractPlugin の順でコンパイル
          test: /\.scss$/,
          use: [{
            loader: MiniCssExtractPlugin.loader,
          }, {
            loader: 'css-loader',
          }, {
            loader: 'sass-loader',
          }],
        },
        {
          // 画像系 => url-loader でコンパイル
          test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
          use: [
            {
              loader: 'url-loader?limit=100000&name=img/[name].[ext]',
            },
          ],
        },
      ],
    },
    // 最適化設定
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin(),
      ],
    },
    // *.js, *.jsx を require 可能に
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    // プラグイン設定
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'src/img/'),
          to: path.resolve(__dirname, 'dist/img/'),
        },
      ]),
      new MiniCssExtractPlugin({
        filename: 'css/style.css',
      }),
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        pngquant: {
          quality: '95-100',
        },
      }),
    ],
  },
];
```

#### package.json
- npm scripts
    - `start`: webpack-dev-server（開発サーバ）実行
    - `dev`: 開発用に webpack でコンパイル実行
    - `prod`: 本番用に webpack でコンパイル実行

```diff
  {
    ...
+   "scripts": {
+     "start": "webpack-dev-server",
+     "dev": "webpack --mode development",
+     "prod": "webpack --mode production"
+   }
  }
```

#### dist/index.html
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SCSS図形</title>
    <!-- Webpack でコンパイルした style.css 読み込み -->
    <link rel="stylesheet" href="./css/style.css">
</head>
<body>
    <div id="app"></div>
    <!-- Webpack でコンパイルした app.js 読み込み -->
    <script src="./js/app.js"></script>
</body>
</html>
```

---

### 動作確認

![sample1.png](./src/img/sample1.png)

#### src/scss/style.scss
```scss
.sample1 {
    width: 200px;
    height: 200px;
    border: solid 1px #000;
    background-color: #f00;
}
```

#### src/js/app.jsx
```jsx
import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
  render () {
    return <div className="sample1"></div>;
  }
}

// '#app' => render React.Component/App
render(<App/>, document.getElementById('app'));
```
