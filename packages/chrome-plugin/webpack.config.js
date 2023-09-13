const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    popup: './popup.js',
    contentScript: './contentScript.js',
  },
  // mode: "development",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './popup.html',
      chunks: ['popup'],
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        test: /\.jsx?$/i,
        use: [
          {
            loader: 'class-to-css-loader',
            options: {
              type: 'react',
              rules: [
                { key: 'ww', valReg: /^bw$/, css: 'word-wrap: break-word' },
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']  
      }
    ]
  }
};