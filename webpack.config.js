const path = require('path');

module.exports = {
  target: "web",
  mode: "development",
  entry: [
    './src/index.tsx',
    'react-hot-loader/patch',
  ],
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "src"),
    },
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules|(\.spec.ts)/,
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/",
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "app": path.resolve(__dirname, "src/"),
      "test": path.resolve(__dirname, "test/"),
    }
  },
};
