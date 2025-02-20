// Get directory dynamically by node.js
const path = require('path');
const webpack = require('webpack');
// const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin');


// CommonJS standards
module.exports = {
  entry: "./src/main.js",  // pack entry to output

  mode: "development",    // or, production

  output: {
    path: path.resolve(__dirname, 'dist'),    //dirname: path of webpack.config.js
    filename: 'bundle.js',
    // publicPath: 'dist/',     // otherwise, cause redundancy by HtmlWebpackPlugin
  },

  module: {
    rules: [
      {test: /\.vue$/,  use: ['vue-loader']},
      {test: /\.css/,  use: ['style-loader', 'css-loader']},

      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'img/[name].[hash:8].[ext]',
              // testing...
              esModule: false
            }
          }
        ],
        // testing
        type: 'javascript/auto'
      },

      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },

      // HTML img compile test
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          esModule: false
        }
      },

    ],
  },

  plugins: [
      new VueLoaderPlugin(),
      new webpack.BannerPlugin("(c) 2022 Yunzhe Wang"),
      new HtmlWebpackPlugin({template: 'index.html'}),
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          jquery: "jquery",
          "window.jQuery": "jquery"
      }),
  ],

  // runtime-only  V.S.  runtime-compiler
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'   // from node_modules
    }
  },

  devServer: {
    contentBase: './src',      // './dist', decide whether file_path can be found [change back when 'npm run build'??]
    inline: true
  },

  // Suppress warnings in console
  performance: {
    hints: "warning", 
    hints: "error", 
    hints: false, 
    maxAssetSize: 200000, 
    maxEntrypointSize: 400000, 
    assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  
}