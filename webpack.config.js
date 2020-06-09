const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const devConfig = require('./webpack.config.dev')
const proConfig = require('./webpack.config.pro')

const baseConfig = {
  entry: {
    base: ['core-js/stable', 'regenerator-runtime/runtime'],
    main: [path.resolve(__dirname, './src/index.js')],
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
    extensions: ['.js'],
  },
  module: {
    rules: [
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
            name: '[name]_[hash].[ext]',
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
  plugins: [
    new htmlWebpackPlugin({
      title: 'My App', //标题
      filename: 'index.html', // 输出的文件名，默认是index.html
      template: './src/index.html', // 模板文件路径
      minify: {
        //压缩HTML文件
        removeomments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符和换行符
        minifyCss: true, //压缩内联css
      },
    }), //插件配置
    new CleanWebpackPlugin({
      //打包之前清理一次
      cleanOnceBeforeBuildPatterns: [
        path.resolve(__dirname, './dist'),
        path.resolve(__dirname, './build'),
      ],
    }),
  ],
}

module.exports = (env) => {
  if (env && env.production) {
    return merge(baseConfig, proConfig)
  } else {
    return merge(baseConfig, devConfig)
  }
}
