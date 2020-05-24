/* eslint-disable node/no-unpublished-import */
import merge from 'webpack-merge';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';

import base from './base';

const config: webpack.Configuration = merge(base, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '..', 'docs'),
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 1000000,
    maxAssetSize: 1000000,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
});

export default config;
