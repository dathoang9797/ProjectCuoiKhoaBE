const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const prod = process.argv[3];

module.exports = {
  target: 'node',
  entry: './src/server.ts',
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  mode: prod ? 'production' : 'development',
  devtool: false,
  output: {
    path: path.resolve(__dirname),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  optimization: {
    minimize: true // enabling this reduces file size and readability
  },
  plugins: [
    new NodePolyfillPlugin(),
    new NodemonPlugin({
      // Extensions to watch.
      ext: 'ts,js,json',
      verbose: true
    }),
    new Dotenv()
  ]
};
