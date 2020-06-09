const path = require('path')
const webpack = require('webpack')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const vConsolePlugin = require('vconsole-webpack-plugin')

module.exports = {
  output: {
    filename: 'js/[name]_[hash:6].js',
    path: path.resolve(__dirname, './dist'),
  },
  // mode:"development",
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        include: path.resolve(__dirname, './src'),
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
  devtool: 'cheap-module-eval-source-map',
  watchOptions: {
    //不监听 node_modules 目录下的文件
    ignored: /node_modules/,
  },
  devServer: {
    contentBase: './dist',
    // open:true,
    port: 8081,
    hot: true,
    hotOnly: true, //即便HMR不生效，浏览器也不自动刷新，就开启hotOnly
    proxy: {
      '/api': {
        target: 'http://localhost:9092',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HardSourceWebpackPlugin(), //缓存文件
    new vConsolePlugin({
      enable: true,
      filter: ['base'],
    }),
  ],
}
