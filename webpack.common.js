const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.ts', // Adjust this path to your library's entry point

  // Adjust output configuration for a library
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'metanet-identity-react.js',
    library: 'MetaNet-Identity-React', // This is the name your library will be available as in global scope for UMD bundles
    libraryTarget: 'umd', // This will make your library available for CommonJS, AMD, and as a global variable
    publicPath: '/',
    umdNamedDefine: true,
    globalObject: 'this'
  },

  // Mark React and other common dependencies as external
  externals: {
    react: 'react',
    'react-dom': 'react-dom'
    // You can add more externals here depending on your library's dependencies
  },
  plugins: [
    new NodePolyfillPlugin(),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: 'public',
    //       globOptions: {
    //         ignore: ['**/index.html']
    //       }
    //     }
    //   ]
    // })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader',
        options: { limit: false }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  }
}
