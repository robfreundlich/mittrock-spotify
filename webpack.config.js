const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require("webpack");

const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';

const plugins = [
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: "./src/index.html",
  }),
];

if (isDevelopment)
{
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new ReactRefreshWebpackPlugin());
}


module.exports = {
  devServer: {
    static: "./dist",
    hot: "only"
  },
  devtool: "inline-source-map",
  entry: './src/index.tsx',
  ignoreWarnings: [/Failed to parse source map/],
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
            plugins: [
              isDevelopment && require.resolve('react-refresh/babel'),
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader",
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ]
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
  plugins: plugins,
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "app": path.resolve(__dirname, "src/"),
      "test": path.resolve(__dirname, "test/"),
    }
  },
  // target: "web",
};
