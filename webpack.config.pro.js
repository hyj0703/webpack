const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const FilemanagerWebpackPlugin = require('filemanager-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const configBase = require('./webpack.config.base.js')

const proConfig = (zip) => ({
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        // include: path.resolve(__dirname, './src'),
        //loader是有顺序的，从后往前
        use: [
          // 'style-loader',//在页面插入css样式
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },

          'css-loader', // 抽取css样式
          'postcss-loader', // 样式前缀自动补全
          'sass-loader', // sass当做css技术栈
        ],
      },
    ],
  },
  optimization: {
    usedExports: true, //只导出被使用的模块
    minimize: true, //启动压缩
    concatenateModules: true, //模块合并
    sideEffects: true, //开启副作用，去掉没使用的代码
    splitChunks: {
      chunks: 'all', //所有的chunks代码公共部分分离出来成为一个单独的文件
      cacheGroups: {
        //缓存组
        react: {
          test: /react|react-dom/,
          name: 'react',
          minChunks: 1,
        },
      },
    },
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        //压缩图片
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
            ],
          },
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      //提取css为单独文件
      filename: 'css/[name]_[contenthash:6].css',
    }),
    zip
      ? new FilemanagerWebpackPlugin({
          events: {
            onEnd: {
              copy: [
                {
                  source: path.resolve(__dirname, './dist'),
                  destination: path.resolve(__dirname, './tmp_for_zip/dist'),
                },
              ],
              archive: [
                {
                  source: path.resolve(__dirname, './tmp_for_zip'),
                  destination: path.resolve(__dirname, './dist.zip'),
                },
              ],
              delete: [path.resolve(__dirname, './tmp_for_zip')],
            },
          },
        })
      : () => {},
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
  ],
})

module.exports = (env) => {
  //env为在指令中配置的参数，--env.debug
  let zip = null
  if (env && env.zip) zip = env.zip //如配置了--env.zip参数，则打一个zip的压缩包
  return merge(configBase, proConfig(zip))
}
