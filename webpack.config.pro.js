const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PurifyCss = require('purifycss-webpack')
const glob = require('glob-all')
const tinyPngWebpackPlugin = require('tinypng-webpack-plugin')
const FilemanagerWebpackPlugin = require('filemanager-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const proConfig = (zip) => ({
  entry: {
    base: ['core-js/stable', 'regenerator-runtime/runtime'],
    main: [path.resolve(__dirname, './src/index.js')],
  },
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
    zip
      ? new FilemanagerWebpackPlugin({
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
  let zip = null
  if (env && env.zip) zip = env.zip
  console.log('zip', zip)
  return proConfig(zip)
}
