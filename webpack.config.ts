/* eslint-disable node/no-unpublished-import */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import path from 'path';

const config: webpack.Configuration = {
  entry: ['./src/index.ts'],
  output: {
    path: path.resolve(__dirname, 'docs'),
  },
  devtool: 'source-map',
  plugins: [new HtmlWebpackPlugin({title: 'Phaser Learning'})],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
};

export default config;
