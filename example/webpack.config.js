var path = require("path")

module.exports = {
  // https://webpack.js.org/configuration/output/
  output: {
    path: path.join(__dirname, "dist"),
    filename: 'main.js'
  },
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8080
  }
}
