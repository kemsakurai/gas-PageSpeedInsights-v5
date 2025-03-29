const path = require('path');
const GasPlugin = require("gas-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')   

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: false,
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: false,
              compilerOptions: {
                target: 'es2015',
                module: 'commonjs'
              }
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }      
    ]
  },
  resolve: {
    extensions: [
      '.ts',
      '.js'
    ]    
  },
  plugins: [
    new GasPlugin(),
    new HtmlWebpackPlugin({
      filename: "./updateSchedule.html",
      template: "./src/updateSchedule.html"
    })
  ]
};
