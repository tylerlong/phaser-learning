/* eslint-disable node/no-unpublished-import */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const config: webpack.Configuration = {
  entry: ['./src/index.ts'],
  plugins: [new HtmlWebpackPlugin({title: 'Phaser Learning'})],
};

export default config;
