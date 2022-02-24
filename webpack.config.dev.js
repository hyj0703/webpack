const path = require('path')
const webpack = require('webpack')
const vConsolePlugin = require('vconsole-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const configBase = require('./webpack.config.base.js')

const devConfig = (debug) => ({
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        // include: path.resolve(__dirname, './src'),
        //loader是有顺序的，从后往前
        use: [
          'style-loader', //在页面插入css样式
          'css-loader', // 抽取css样式
          'postcss-loader', // 样式前缀自动补全
          'sass-loader', // sass当做css技术栈
        ],
      },
    ],
  },
  devtool: 'eval-cheap-module-source-map',
  watchOptions: {
    //不监听 node_modules 目录下的文件
    ignored: /node_modules/,
  },

  devServer: {
    contentBase: './dist',
    // open: true,
    port: 8081,
    hot: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:9092',
    //     changeOrigin: true,
    //   },
    // },
  },
  cache: {
    //开启缓存
    type: 'filesystem', //文件缓存 memory内容缓存
    cacheDirectory: path.join(__dirname, 'node_modules/.cac/webpack'),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new vConsolePlugin({
      enable: debug,
      filter: ['base'],
    }),
    new htmlWebpackPlugin({
      title: 'My App', //标题
      filename: 'index.html', // 输出的文件名，默认是index.html
      template: './src/index.html', // 模板文件路径
    }), //插件配置
  ],
})

module.exports = (env) => {
  //env为在指令中配置的参数，--env.debug，
  let debug = null
  if (env && env.debug) debug = env.debug //如配置了--env.debug参数，则开启vConsolePlugin
  return merge(configBase, devConfig(debug))
}
