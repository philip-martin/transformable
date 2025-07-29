const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const makeConfig = (minimize, mode, filenameSuffix = '') => ({
  entry: './src/js/transformable.js',
  output: {
    filename: `transformable${filenameSuffix}.umd.js`,
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
    new MiniCssExtractPlugin({ filename: `../css/transformable${filenameSuffix}.css` })
  ],
  optimization: {
    minimize,
    minimizer: minimize ? [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ] : [],
  },
  resolve: {
    extensions: ['.js']
  },
  target: ['web', 'es5'],
  mode,
  devtool: mode === 'development' ? 'source-map' : false
});

const makeESMConfig = (minimize, mode, filenameSuffix = '') => ({
  entry: './src/js/transformable.js',
  output: {
    filename: `transformable${filenameSuffix}.esm.js`,
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
    new MiniCssExtractPlugin({ filename: `../css/transformable${filenameSuffix}.css` })
  ],
  optimization: {
    minimize,
    minimizer: minimize ? [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ] : [],
  },
  resolve: {
    extensions: ['.js']
  },
  target: ['web', 'es2020'],
  mode,
  devtool: mode === 'development' ? 'source-map' : false
});

module.exports = [
  // UMD production
  makeConfig(true, 'production'),
  // UMD development (non-minified, with source maps)
  makeConfig(false, 'development', '.dev'),
  // ESM production
  makeESMConfig(true, 'production'),
  // ESM development (non-minified, with source maps)
  makeESMConfig(false, 'development', '.dev'),
];
