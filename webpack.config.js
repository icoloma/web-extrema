var webpack = require("webpack");

module.exports = {
  entry: {
    "website/js/scripts.min.js": "./src/js/scripts.js"
  },
  output: {
    path: __dirname,
    filename: "[name]"
  },
  resolve: {
    mainFields: ["jsnext:main", "browser", "main"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["es2015", { modules: false }]],
              plugins: [
                "transform-object-rest-spread",
                "transform-class-properties"
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: "[name].js.map",
      columns: false
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
