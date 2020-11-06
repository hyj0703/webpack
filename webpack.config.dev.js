const path = require('path')
const webpack = require('webpack')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const vConsolePlugin = require('vconsole-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const devConfig = (debug) => ({
  entry: {
    base: ['core-js/stable', 'regenerator-runtime/runtime'],
    main: [path.resolve(__dirname, './src/index.js')],
  },
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
      {
        test: /\.jsx?$/, //适配js和jsx
        include: path.resolve(__dirname, './src'),
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpe?g|git)$/,
        include: path.resolve(__dirname, './src'),
        //use使用一个loader可以用对象，字符串，两个loader需要用数组
        use: {
          loader: 'file-loader',
          //options额外的配置，比如资源名称
          options: {
            //placeholder 占位符 [name]老资源模块的名称 [ext]老资源模块的后缀
            name: '[name]_[hash:6].[ext]',
            //打包后存放的位置
            outputPath: 'images/',
          },
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        include: path.resolve(__dirname, './src'),
        use: 'file-loader',
      },
    ],
  },
  devtool: 'cheap-module-eval-source-map',
  watchOptions: {
    //不监听 node_modules 目录下的文件
    ignored: /node_modules/,
  },
  resolve: {
    modules: [path.resolve(__dirname, './node_modules')],
    alias: {
      react: path.resolve(
        __dirname,
        './node_modules/react/umd/react.production.min.js'
      ),
      'react-dom': path.resolve(
        __dirname,
        './node_modules/react-dom/umd/react-dom.production.min.js'
      ),
    },
    extensions: ['.js', '.json', '.jsx', '.ts'],
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HardSourceWebpackPlugin(), //缓存文件
    new vConsolePlugin({
      enable: debug,
      filter: ['base'],
    }),
    new htmlWebpackPlugin({
      title: 'My App', //标题
      filename: 'index.html', // 输出的文件名，默认是index.html
      template: './src/index.html', // 模板文件路径
    }), //插件配置
    new CleanWebpackPlugin({
      //打包之前清理一次
      cleanOnceBeforeBuildPatterns: [
        path.resolve(__dirname, './dist'),
        path.resolve(__dirname, './build'),
      ],
    }),
  ],
})

module.exports = (env) => {
  //env为在指令中配置的参数，--env.debug，
  let debug = null
  if (env && env.debug) debug = env.debug //如配置了--env.debug参数，则开启vConsolePlugin
  return devConfig(debug)
}
