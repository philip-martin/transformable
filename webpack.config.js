const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = [
  // UMD build for browser
  {
    entry: './src/js/transformable.js',
    output: {
      filename: 'transformable.umd.js',
      path: path.resolve(__dirname, 'dist/js'),
      library: 'Transformable',
      libraryTarget: 'umd',
      libraryExport: 'default',
      globalObject: 'this'
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: '../css/transformable.css' })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
    resolve: {
      extensions: ['.js']
    },
    target: ['web', 'es5'],
  },
  // ESM build for NPM/bundlers
  {
    entry: './src/js/transformable.js',
    output: {
      filename: 'transformable.esm.js',
      path: path.resolve(__dirname, 'dist/js'),
      library: { type: 'module' }
    },
    experiments: { outputModule: true },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: '../css/transformable.css' })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
    resolve: {
      extensions: ['.js']
    },
    target: ['web', 'es2020'],
  }
];
