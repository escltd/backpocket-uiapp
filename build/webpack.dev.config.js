const base = require("./webpack.base.config")
const {merge} = require("webpack-merge")
const webpack = require("webpack")
const config = require('.././config/dev.config')

module.exports = merge(base, {
  // This contains additional production settings
  plugins: [
    new webpack.DefinePlugin({
      "process": {
        env: config
      }
    })
  ],
  devServer: {
    port: 8080,
    host: "0.0.0.0",
    overlay: true,
    disableHostCheck: true,
    proxy : {
          '/ws': { target: 'ws://localhost:8181', changeOrigin: true, ws: true },
          // '/ws': { target: 'wss://backpocket.africa', changeOrigin: true, ws: true },
    }
  }

})
