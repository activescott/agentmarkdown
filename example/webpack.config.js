var path = require("path")

module.exports = {
  mode: "production",
  // https://webpack.js.org/configuration/output/
  output: {
    path: path.join(__dirname, "dist"),
    filename: "main.js",
  },
  resolve: {
    fallback: {
      // webpack < 5 used to include polyfills for node.js core modules by default. This is no longer the case, so we include events fallback for browsers
      events: require.resolve("events/"),
    },
  },
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 8080,
  },
}
