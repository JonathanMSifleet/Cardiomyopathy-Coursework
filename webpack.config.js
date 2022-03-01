const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devtool: 'eval-source-map',
  output: {
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'build'),
    pathinfo: false
  },
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  resolve: {
    extensions: ['.js', '.vue']
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          hotReload: true
        }
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { modules: true }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        type: 'asset/inline'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new VueLoaderPlugin(),
    // define process variables here:
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      "process.env.DEVELOPMENT": JSON.stringify(true),
      "process.env.API_KEY": JSON.stringify('AIzaSyCHWE9w0W9Z3BO_mGQakqkm-GAs2jhZTUE'),
      "process.env.AUTH_DOMAIN": JSON.stringify('adv-web-test.firebaseapp.com'),
      "process.env.PROJECT_ID": JSON.stringify('adv-web-test'),
      "process.env.STORAGE_BUCKET": JSON.stringify('adv-web-test.appspot.com'),
      "process.env.MESSAGING_SENDER_ID": JSON.stringify('412829793841'),
      "process.env.APP_ID": JSON.stringify('1:412829793841:web:b1be5d7cf02a310f4b5f10')
    })
  ]
};
