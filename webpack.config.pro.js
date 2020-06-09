const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PurifyCss = require('purifycss-webpack')
const glob = require('glob-all')
const tinyPngWebpackPlugin = require('tinypng-webpack-plugin')
const FilemanagerWebpackPlugin = require('filemanager-webpack-plugin')

module.exports = {
  output: {
    filename: 'js/[name]_[hash:6].js',
    path: path.resolve(__dirname, './build'),
  },
  // mode:"development",
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        include: path.resolve(__dirname, './src'),
        //loader是有顺序的，从后往前
        use: [
          // 'style-loader',//在页面插入css样式
          MiniCssExtractPlugin.loader,
          'css-loader', // 抽取css样式
          'postcss-loader', // 样式前缀自动补全
          'sass-loader', // sass当做css技术栈
        ],
      },
    ],
  },
  optimization: {
    usedExports: true, //哪些导出的模块被使用了，再做打包
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
  },
  plugins: [
    new PurifyCss({
      // 清除无用css
      paths: glob.sync([
        // 要做css Tree Shaking的路径文件
        path.resolve(__dirname, './src/*.html'),
        path.resolve(__dirname, './src/*.js'),
      ]),
    }),
    new OptimizeCssAssetsPlugin({
      //压缩css
      cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: { removeAll: true },
      },
    }),
    new MiniCssExtractPlugin({
      //提取css为单独文件
      filename: 'css/[name]_[contenthash:6].css',
    }),
    new tinyPngWebpackPlugin({
      key: [
        '----------这里填入申请到的API key--------',
        '----------这里填入申请到的API key--------',
        '----------这里填入申请到的API key--------',
        '----------这里填入申请到的API key--------',
        '----------这里填入申请到的API key--------',
      ],
      ext: ['png', 'jpeg', 'jpg', 'gif'],
    }),
    new FilemanagerWebpackPlugin({
      onEnd: {
        copy: [
          {
            source: path.resolve(__dirname, './build'),
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
    }),
  ],
}
