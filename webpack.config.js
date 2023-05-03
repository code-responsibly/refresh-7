const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  mode: "development",
  // devtool: false,
  entry: {
    index: "./src/ts/app.ts",
  },
  output: {
    path: path.resolve(__dirname, "src"),
    filename: "js/[name].bundle.js",
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "all",
      name: "vendor"
    },
  },
 // plugins: [new BundleAnalyzerPlugin()],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
  externals: {},
};
