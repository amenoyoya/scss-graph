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