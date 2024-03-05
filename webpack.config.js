const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require('path');

module.exports = {
  devServer: {
    static: "./dist",
    hot: true
  },
  devtool: "inline-source-map",
  entry: [
    './src/index.tsx',
    'react-hot-loader/patch',
  ],
  // ignoreWarnings: [/Failed to parse source map/],
  mode: "none",
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   enforce: "pre",
      //   use: ["source-map-loader"],
      // },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules|(\.spec.ts)/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ],
  },
  optimization: {
    nodeEnv: 'development',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "app": path.resolve(__dirname, "src/"),
      "test": path.resolve(__dirname, "test/"),
    }
  },
  // target: "web",
};
