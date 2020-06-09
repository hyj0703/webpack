const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const devConfig = require('./webpack.config.dev')
const proConfig = require('./webpack.config.pro')

const baseConfig = {
  module: {
    rules: [
    ],
  },
  plugins: [
  ],
}

module.exports = (env) => {
  if (env && env.production) {
    return merge(baseConfig, proConfig)
  } else {
    return merge(baseConfig, devConfig)
  }
}
