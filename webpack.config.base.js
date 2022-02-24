const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    main: [path.resolve(__dirname, './src/index.js')],
  },
  output: {
    filename: 'js/[name]_[contenthash:6].js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, //适配js和jsx
        // include: path.resolve(__dirname, './src'),
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024,
          },
        },
        generator: {
          filename: 'images/[name][contenthash:3].[ext]',
        },
      },
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[ext]',
        },
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
    extensions: ['.js', '.json', '.jsx', '.ts'],
  },
  plugins: [
    new CleanWebpackPlugin({
      //打包之前清理一次
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, './dist')],
    }),
  ],
}
